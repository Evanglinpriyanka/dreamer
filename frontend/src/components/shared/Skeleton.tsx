import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "circular" | "rectangular" | "text";
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({
  className,
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-muted";

  const variantClasses = {
    circular: "rounded-full",
    rectangular: "rounded-lg",
    text: "rounded h-4",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
    />
  );
};

// Dashboard Skeleton
export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4 mb-8">
          <Skeleton className="w-64 h-10 mx-auto" variant="rectangular" />
          <Skeleton className="w-96 h-5 mx-auto" variant="rectangular" />
        </div>

        {/* Profile Card Skeleton */}
        <div className="glass p-8 mb-8 rounded-xl">
          <div className="flex items-start gap-6">
            <Skeleton className="w-20 h-20" variant="circular" />
            <div className="flex-1 space-y-4">
              <Skeleton className="w-48 h-8" variant="rectangular" />
              <Skeleton className="w-full h-4" variant="rectangular" />
              <Skeleton className="w-3/4 h-4" variant="rectangular" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="w-20 h-6" variant="rectangular" />
                <Skeleton className="w-24 h-6" variant="rectangular" />
                <Skeleton className="w-16 h-6" variant="rectangular" />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Skeleton */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Skeleton className="w-64 h-8 mx-auto" variant="rectangular" />
            <Skeleton className="w-80 h-5 mx-auto" variant="rectangular" />
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-6 rounded-xl space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="w-48 h-6" variant="rectangular" />
                  <Skeleton className="w-64 h-4" variant="rectangular" />
                </div>
                <Skeleton className="w-20 h-8" variant="rectangular" />
              </div>
              <Skeleton className="w-full h-2" variant="rectangular" />
              <div className="grid md:grid-cols-4 gap-4">
                <Skeleton className="h-16" variant="rectangular" />
                <Skeleton className="h-16" variant="rectangular" />
                <Skeleton className="h-16" variant="rectangular" />
                <Skeleton className="h-16" variant="rectangular" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-20 h-6" variant="rectangular" />
                <Skeleton className="w-24 h-6" variant="rectangular" />
                <Skeleton className="w-16 h-6" variant="rectangular" />
                <Skeleton className="w-28 h-6" variant="rectangular" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Roadmap Skeleton
export const RoadmapSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-32 h-10" variant="rectangular" />
        </div>
        <div className="text-center space-y-4 mb-8">
          <Skeleton className="w-80 h-10 mx-auto" variant="rectangular" />
          <Skeleton className="w-96 h-5 mx-auto" variant="rectangular" />
          <Skeleton className="w-64 h-16 mx-auto" variant="rectangular" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Roadmap Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-48 h-8" variant="rectangular" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass p-6 rounded-xl space-y-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-6 h-6" variant="circular" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-64 h-6" variant="rectangular" />
                    <Skeleton className="w-full h-4" variant="rectangular" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="w-20 h-6" variant="rectangular" />
                  <Skeleton className="w-24 h-6" variant="rectangular" />
                  <Skeleton className="w-16 h-6" variant="rectangular" />
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-64" variant="rectangular" />
            <Skeleton className="h-48" variant="rectangular" />
            <Skeleton className="h-48" variant="rectangular" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Card Skeleton
export const CardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`glass p-6 rounded-xl space-y-4 ${className}`}>
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12" variant="circular" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-48 h-6" variant="rectangular" />
          <Skeleton className="w-64 h-4" variant="rectangular" />
        </div>
      </div>
      <Skeleton className="w-full h-20" variant="rectangular" />
      <div className="flex gap-2">
        <Skeleton className="w-16 h-6" variant="rectangular" />
        <Skeleton className="w-20 h-6" variant="rectangular" />
        <Skeleton className="w-24 h-6" variant="rectangular" />
      </div>
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-8 h-8" variant="circular" />
          <Skeleton className="flex-1 h-12" variant="rectangular" />
          <Skeleton className="w-24 h-12" variant="rectangular" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
