export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-24 md:pt-0">
      <div className="relative h-64 md:h-[400px] w-full bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 pb-10 space-y-4">
            <div className="h-4 bg-gray-300 rounded w-40" />
            <div className="h-12 bg-gray-300 rounded w-3/4" />
            <div className="flex gap-4">
              <div className="h-10 bg-gray-300 rounded-full w-32" />
              <div className="h-10 bg-gray-300 rounded-full w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        <div className="lg:col-span-2 space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <div className="h-8 bg-gray-100 rounded w-1/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-50 rounded w-full" />
                <div className="h-4 bg-gray-50 rounded w-full" />
                <div className="h-4 bg-gray-50 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-[400px] bg-white rounded-3xl shadow-sm border border-gray-100 animate-pulse" />
      </div>
    </main>
  );
}
