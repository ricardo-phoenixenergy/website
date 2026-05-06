export default function SolarValuationLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="page-container pt-24 pb-6">

        {/* Breadcrumb skeleton */}
        <div className="shimmer h-4 w-56 rounded mb-6" />

        {/* Centred header skeleton */}
        <div className="max-w-[600px] mx-auto text-center mb-10">
          <div className="shimmer h-3 w-28 rounded mx-auto mb-3" />
          <div className="shimmer h-10 w-80 rounded mx-auto mb-3" />
          <div className="shimmer h-4 w-96 rounded mx-auto mb-2" />
          <div className="shimmer h-4 w-72 rounded mx-auto" />
        </div>

      </div>

      {/* Tool skeleton */}
      <div className="page-container pb-16">
        <div className="shimmer rounded-2xl" style={{ height: '480px' }} />
      </div>
    </div>
  );
}
