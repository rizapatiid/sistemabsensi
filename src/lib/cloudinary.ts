import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// It will automatically use the CLOUDINARY_URL environment variable if present.
// Alternatively, we can configure it manually if needed, but it's best to rely on env vars.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 encoded image to Cloudinary.
 * @param base64String The base64 string representing the image (e.g. data:image/jpeg;base64,...)
 * @param folder The folder in Cloudinary where the image should be stored
 * @returns The secure URL of the uploaded image, or null if upload fails or string is empty
 */
export async function uploadBase64Image(base64String: string | null | undefined, folder: string = 'absensi'): Promise<string | null> {
  if (!base64String || !base64String.startsWith('data:image')) {
    // If it's already an HTTP URL (e.g., an existing image being updated), just return it
    if (base64String && base64String.startsWith('http')) {
      return base64String;
    }
    return null; // Return null if it's not a valid base64 image or url
  }

  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      // You can add transformations here if you want to compress images further
      // transformation: [{ width: 800, crop: 'limit' }, { quality: 'auto' }]
    });
    
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
}
