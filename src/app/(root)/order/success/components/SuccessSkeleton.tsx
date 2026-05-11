import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const SuccessPageSkeleton = () => {
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Hero Skeleton */}
        <Card>
          <CardContent className="pt-10 pb-8 px-6 text-center space-y-4">
            <Skeleton className="w-16 h-16 rounded-full mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
            <Skeleton className="h-6 w-40 mx-auto" />
          </CardContent>
        </Card>

        {/* Tracker Skeleton */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </CardContent>
        </Card>

        {/* Items Skeleton */}
        <Card>
          <CardContent className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Skeleton className="w-11 h-11 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Address Skeleton */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>

        {/* Info Grid Skeleton */}
        <Card>
          <CardContent className="p-6 grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Buttons Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

      </div>
    </div>
  )
}