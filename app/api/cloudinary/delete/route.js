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
        console.log('Attempting to delete image with public_id:', publicId);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary delete result:', result);
        
        if (result.result === 'ok') {
            return new Response(
                JSON.stringify({ message: 'Image deleted successfully' }),
                { status: 200 }
            );
        } else if (result.result === 'not found') {
            return new Response(
                JSON.stringify({ error: 'Image not found in Cloudinary' }),
                { status: 404 }
            );
        } else {
            return new Response(
                JSON.stringify({ 
                    error: 'Failed to delete image from Cloudinary',
                    details: result 
                }),
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
        console.log('Attempting to extract public_id from URL:', url);
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) {
            console.log('Upload index not found in URL');
            return null;
        }
        
        let startIndex = uploadIndex + 1;
        if (parts[startIndex] && parts[startIndex].startsWith('v')) {
            startIndex = uploadIndex + 2;
        }
        let publicIdParts = parts.slice(startIndex);
        let publicIdPart = publicIdParts.join('/');
        const lastDotIndex = publicIdPart.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            publicIdPart = publicIdPart.substring(0, lastDotIndex);
        }
        
        console.log('Extracted public_id:', publicIdPart);
        return publicIdPart;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
}
