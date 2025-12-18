export function ClosetSkeleton() {
  return (
    <div className="masonry">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="masonry-item rounded-xl overflow-hidden bg-card animate-fade-in"
          style={{ 
            animationDelay: `${index * 50}ms`,
            height: `${Math.random() * 100 + 250}px` 
          }}
        >
          <div className="w-full h-full skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}
