export default function BlogLoading() {
  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5', paddingTop: '80px' }}>
      <div className="max-w-content mx-auto px-6 py-10">
        {/* Header skeleton */}
        <div className="grid gap-8 mb-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <div className="shimmer h-4 w-32 rounded mb-3" />
            <div className="shimmer h-9 w-80 rounded mb-2" />
            <div className="shimmer h-4 w-96 rounded" />
          </div>
          <div className="shimmer h-11 rounded-full" />
        </div>

        {/* Filter pills skeleton */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer h-8 w-28 rounded-full" />
          ))}
        </div>

        {/* Featured card skeleton */}
        <div className="shimmer rounded-card mb-6" style={{ height: '220px' }} />

        {/* Grid skeleton */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer rounded-card" style={{ height: '240px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
