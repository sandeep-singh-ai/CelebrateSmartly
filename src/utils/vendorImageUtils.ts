// Helper function to safely convert Json to string array
export const jsonToStringArray = (jsonData: any): string[] => {
  if (Array.isArray(jsonData)) {
    return jsonData.filter(item => typeof item === 'string');
  }
  return [];
};

// Helper function to filter S3 images from a mixed array
export const filterS3Images = (images: any): string[] => {
  const imageArray = jsonToStringArray(images);
  return imageArray.filter(img => 
    img && typeof img === 'string' && 
    (img.includes('s3.amazonaws.com') || img.includes('celebratesmartly.s3'))
  );
};

// Helper function to filter Google images from a mixed array
export const filterGoogleImages = (images: any): string[] => {
  const imageArray = jsonToStringArray(images);
  return imageArray.filter(img => 
    img && typeof img === 'string' && 
    img.includes('googleapis.com')
  );
};

// Helper: filter any non-S3 images (includes Google, Supabase Storage, etc.)
export const filterNonS3Images = (images: any): string[] => {
  const imageArray = jsonToStringArray(images);
  return imageArray.filter(img => 
    img && typeof img === 'string' && 
    !(img.includes('s3.amazonaws.com') || img.includes('celebratesmartly.s3'))
  );
};

// Helper function to prioritize S3 images over Google images, while preserving others as fallback
export const prioritizeS3Images = (images: string[]): string[] => {
  if (!Array.isArray(images)) return [];
  const valid = images.filter(img => typeof img === 'string' && img.length > 0);

  const s3Images = valid.filter(img =>
    img.includes('s3.amazonaws.com') || img.includes('celebratesmartly.s3')
  );

  const googleImages = valid.filter(img => img.includes('googleapis.com'));

  const others = valid.filter(img => !s3Images.includes(img) && !googleImages.includes(img));

  const prioritizedImages = [...s3Images, ...googleImages, ...others];
  // Note: for SEO and reliability, prefer S3 images on details and grid views
  return prioritizedImages;
};

// Helper function to check if an image URL is from S3
export const isS3Image = (url: string): boolean => {
  return url.includes('s3.amazonaws.com') || url.includes('celebratesmartly.s3');
};

// Helper function to check if an image URL is from Google
export const isGoogleImage = (url: string): boolean => {
  return url.includes('googleapis.com');
};