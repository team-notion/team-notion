export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration is missing');
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'car-rentals');
    formData.append('tags', 'car,vehicle,rental');

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;

  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

// Batch upload multiple images
export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  return await Promise.all(uploadPromises);
};