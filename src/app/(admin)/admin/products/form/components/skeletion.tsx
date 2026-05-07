import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductFormSkeleton = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 grid grid-cols-[1fr_320px] gap-6">

      {/* LEFT */}
      <div className="space-y-5">

        {/* Product Info */}
        <Card className="p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
        </Card>

        {/* Images */}
        <Card className="p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-24 w-24 rounded-md" />
            <Skeleton className="h-24 w-24 rounded-md" />
            <Skeleton className="h-24 w-24 rounded-md" />
          </div>
        </Card>

        {/* Variations */}
        <Card className="p-5 space-y-3">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>

      {/* RIGHT */}
      <div className="space-y-5">
        <Card className="p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </Card>

        <Card className="p-5 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-20 w-full" />
        </Card>
      </div>
    </div>
  );
};