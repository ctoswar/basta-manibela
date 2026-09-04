export default function ListingLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="h-96 animate-pulse rounded-sm bg-surface" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded-sm bg-surface" />
          <div className="h-10 w-3/4 animate-pulse rounded-sm bg-surface" />
          <div className="h-8 w-40 animate-pulse rounded-sm bg-surface" />
          <div className="h-20 w-full animate-pulse rounded-sm bg-surface" />
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded-sm bg-surface" />
                <div className="h-4 w-24 animate-pulse rounded-sm bg-surface" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
