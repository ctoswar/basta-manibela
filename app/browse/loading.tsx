export default function BrowseLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-10 w-64 animate-pulse rounded-sm bg-surface" />
      <div className="mt-3 h-5 w-40 animate-pulse rounded-sm bg-surface" />

      <div className="mt-8 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-sm bg-surface" />
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-sm bg-surface">
            <div className="h-48 w-full animate-pulse bg-surface2" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded-sm bg-surface2" />
              <div className="h-5 w-1/3 animate-pulse rounded-sm bg-surface2" />
              <div className="h-3 w-1/2 animate-pulse rounded-sm bg-surface2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
