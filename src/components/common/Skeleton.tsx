export const Skeleton = ({
  className = '',
  variant = 'rectangular'
}: {
  className?: string;
  variant?: 'circular' | 'rectangular' | 'text';
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';
  const variantClasses = {
    circular: 'rounded-full',
    rectangular: 'rounded',
    text: 'rounded h-4'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export const ImageSkeleton = ({ className = '' }: { className?: string }) => (
  <Skeleton className={className} variant="rectangular" />
);

export const TextSkeleton = ({ lines = 1 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" className="w-full" />
    ))}
  </div>
);
