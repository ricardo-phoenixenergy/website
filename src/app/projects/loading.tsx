export default function ProjectsLoading() {
  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5', paddingTop: '80px' }}>
      <div className="max-w-content mx-auto px-6 py-10">
        {/* Header skeleton */}
        <div className="shimmer h-4 w-24 rounded mb-3" />
        <div className="shimmer h-9 w-72 rounded mb-2" />
        <div className="shimmer h-4 w-96 rounded mb-8" />

        {/* Filter pills skeleton */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="shimmer h-8 w-24 rounded-full" />
          ))}
        </div>

        {/* Featured card skeleton */}
        <div className="shimmer w-full rounded-featured mb-6" style={{ height: '320px' }} />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer rounded-card" style={{ height: '280px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
