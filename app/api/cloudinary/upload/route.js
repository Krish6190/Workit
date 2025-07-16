import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        
        if (!file) {
            return new Response(
                JSON.stringify({ error: 'No file provided' }),
                { status: 400 }
            );
        }
        if (!file.type.startsWith('image/')) {
            return new Response(
                JSON.stringify({ error: 'Please select an image file' }),
                { status: 400 }
            );
        }
        if (file.size > 5 * 1024 * 1024) {
            return new Response(
                JSON.stringify({ error: 'Image size must be less than 5MB' }),
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        return new Response(
            JSON.stringify({ 
                message: 'Image uploaded successfully',
                url: result.secure_url,
                public_id: result.public_id
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error('Error uploading image:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to upload image' }),
            { status: 500 }
        );
    }
}
