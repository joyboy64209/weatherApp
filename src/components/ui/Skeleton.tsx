import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`animate-pulse rounded-lg bg-white/10 dark:bg-white/5 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function WeatherSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading weather data">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-24" count={4} />
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-48" />
      <span className="sr-only">Loading weather data...</span>
    </div>
  );
}