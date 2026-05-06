export default function ToolsLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="page-container pt-24 pb-16">

        {/* Breadcrumb skeleton */}
        <div className="shimmer h-4 w-32 rounded mb-6" />

        {/* Header skeleton */}
        <div className="shimmer h-3 w-28 rounded mb-3" />
        <div className="shimmer h-10 w-72 rounded mb-3" />
        <div className="shimmer h-4 w-96 rounded mb-2" />
        <div className="shimmer h-4 w-80 rounded mb-10" />

        {/* Tool cards skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="shimmer rounded-2xl" style={{ height: '280px' }} />
          ))}
        </div>

      </div>
    </div>
  );
}
