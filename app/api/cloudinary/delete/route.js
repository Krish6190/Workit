import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request) {
    try {
        const { imageUrl } = await request.json();
        
        if (!imageUrl) {
            return new Response(
                JSON.stringify({ error: 'Image URL is required' }),
                { status: 400 }
            );
        }

        const publicId = extractPublicId(imageUrl);
        
        if (!publicId) {
            return new Response(
                JSON.stringify({ error: 'Invalid Cloudinary URL' }),
                { status: 400 }
            );
        }
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result === 'ok') {
            return new Response(
                JSON.stringify({ message: 'Image deleted successfully' }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Failed to delete image from Cloudinary' }),
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}

function extractPublicId(url) {
    try {
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) return null;
        let publicIdPart = parts[uploadIndex + 2]; 
        const lastDotIndex = publicIdPart.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            publicIdPart = publicIdPart.substring(0, lastDotIndex);
        }
        
        return publicIdPart;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
}
