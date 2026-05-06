export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero skeleton */}
      <div className="shimmer w-full" style={{ height: 480 }} />

      <div className="page-container py-10">
        {/* Stats strip skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px] rounded-xl overflow-hidden p-[3px] mb-10" style={{ background: '#0d1f22' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shimmer rounded-lg" style={{ height: 90 }} />
          ))}
        </div>

        {/* Numbered sections skeleton */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-10 grid md:grid-cols-[80px_1fr] gap-6">
            <div className="shimmer h-12 w-12 rounded-xl" />
            <div>
              <div className="shimmer h-6 w-48 rounded mb-3" />
              <div className="shimmer h-4 w-full rounded mb-2" />
              <div className="shimmer h-4 w-full rounded mb-2" />
              <div className="shimmer h-4 w-2/3 rounded" />
            </div>
          </div>
        ))}

        {/* Gallery skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="shimmer rounded-xl" style={{ height: 200 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
