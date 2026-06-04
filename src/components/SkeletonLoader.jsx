export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 animate-fade-up">
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">

        {/* Thumbnail skeleton */}
        <div className="shimmer h-48 w-full" />

        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="shimmer h-5 w-3/4 rounded-lg" />
          <div className="shimmer h-4 w-1/2 rounded-lg" />

          {/* Stats row */}
          <div className="flex gap-3 mt-4">
            <div className="shimmer h-4 w-24 rounded-lg" />
            <div className="shimmer h-4 w-24 rounded-lg" />
            <div className="shimmer h-4 w-24 rounded-lg" />
          </div>

          {/* Format tabs */}
          <div className="flex gap-2 mt-6">
            <div className="shimmer h-10 w-28 rounded-xl" />
            <div className="shimmer h-10 w-28 rounded-xl" />
          </div>

          {/* Format options */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shimmer h-16 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}