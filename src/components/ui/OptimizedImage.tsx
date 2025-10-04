type OptimizedImageProps = {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  responsive?: boolean;
};

export function OptimizedImage({
  publicId,
  alt,
  width,
  className,
  priority = false,
}: OptimizedImageProps) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  // Build optimized Cloudinary URL with transformations
  const transformations = [
    'f_auto', // Auto format (WebP, AVIF)
    'q_auto', // Auto quality
    width ? `w_${width}` : null,
  ].filter(Boolean).join(',');

  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
