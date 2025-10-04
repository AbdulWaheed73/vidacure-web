import { Cloudinary } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';

// Initialize Cloudinary instance
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true // Force HTTPS
  }
});

// Helper function to get optimized image URL
export const getCloudinaryUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
  }
) => {
  const image = cloudinary.image(publicId);

  // Apply transformations
  if (options?.width) {
    image.resize(scale().width(options.width));
  }

  // Apply quality and format
  image.delivery(format(autoFormat()));
  image.delivery(quality(autoQuality()));

  return image.toURL();
};
