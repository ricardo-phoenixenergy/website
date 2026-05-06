export default function AuthorLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]" style={{ paddingTop: '80px' }}>
      <div className="page-container py-10">
        {/* Author hero */}
        <div className="flex items-start gap-6 mb-10">
          <div className="shimmer w-20 h-20 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <div className="shimmer h-8 w-48 rounded mb-2" />
            <div className="shimmer h-4 w-32 rounded mb-4" />
            <div className="shimmer h-4 w-full rounded mb-2" />
            <div className="shimmer h-4 w-4/5 rounded" />
          </div>
        </div>

        {/* Posts heading */}
        <div className="shimmer h-6 w-40 rounded mb-6" />

        {/* Article card grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer rounded-2xl" style={{ height: 280 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
