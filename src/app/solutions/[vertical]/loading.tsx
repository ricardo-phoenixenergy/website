export default function SolutionLoading() {
  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5' }}>
      {/* Hero skeleton */}
      <div className="shimmer w-full" style={{ height: '300px' }} />

      {/* Stats strip skeleton */}
      <div
        className="grid gap-0"
        style={{ background: '#39575C', height: '60px', gridTemplateColumns: 'repeat(4, 1fr)' }}
      />

      <div className="max-w-content mx-auto px-6 py-10">
        {/* Pain section skeleton */}
        <div className="shimmer rounded-card mb-6" style={{ height: '280px' }} />

        {/* Tabs skeleton */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer h-10 w-28 rounded" />
          ))}
        </div>
        <div className="shimmer rounded-card" style={{ height: '200px' }} />
      </div>
    </div>
  );
}
