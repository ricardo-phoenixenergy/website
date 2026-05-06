export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero skeleton */}
      <div className="shimmer w-full" style={{ height: 420 }} />

      <div className="page-container py-10 max-w-[760px] mx-auto">
        {/* Category + meta */}
        <div className="flex items-center gap-3 mb-5">
          <div className="shimmer h-6 w-28 rounded-full" />
          <div className="shimmer h-4 w-20 rounded" />
          <div className="shimmer h-4 w-16 rounded" />
        </div>

        {/* Title */}
        <div className="shimmer h-10 w-full rounded mb-2" />
        <div className="shimmer h-10 w-4/5 rounded mb-6" />

        {/* Author row */}
        <div className="flex items-center gap-3 mb-10 pb-6" style={{ borderBottom: '1px solid #E5E7EB' }}>
          <div className="shimmer w-10 h-10 rounded-full flex-shrink-0" />
          <div>
            <div className="shimmer h-4 w-28 rounded mb-1" />
            <div className="shimmer h-3 w-20 rounded" />
          </div>
        </div>

        {/* Body paragraphs */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mb-4">
            <div className="shimmer h-4 w-full rounded mb-2" />
            <div className="shimmer h-4 w-full rounded mb-2" />
            <div className="shimmer h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
