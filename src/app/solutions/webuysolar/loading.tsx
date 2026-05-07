export default function SolutionLoading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] animate-pulse">
      <div className="h-[460px] bg-[#E5E7EB] w-full" />
      <div className="h-20 bg-[#d1d5db] w-full" />
      <div className="max-w-[960px] mx-auto px-6 py-16 space-y-8">
        <div className="h-6 bg-[#E5E7EB] rounded w-1/4" />
        <div className="h-10 bg-[#E5E7EB] rounded w-2/3" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-[#E5E7EB] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
