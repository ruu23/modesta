import { useRef, useState, useCallback, useMemo, memo, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  getItemKey: (item: T, index: number) => string | number;
}

function VirtualListInner<T>({
  items,
  itemHeight,
  renderItem,
  className,
  overscan = 5,
  getItemKey,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    setContainerHeight(container.clientHeight);

    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { virtualItems, totalHeight, paddingTop } = useMemo(() => {
    if (containerHeight === 0) {
      return { virtualItems: [], totalHeight: 0, paddingTop: 0 };
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);

    const virtualItems = items.slice(startIndex, endIndex).map((item, i) => ({
      item,
      index: startIndex + i,
    }));

    return {
      virtualItems,
      totalHeight: items.length * itemHeight,
      paddingTop: startIndex * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn('overflow-auto', className)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${paddingTop}px)` }}>
          {virtualItems.map(({ item, index }) => (
            <div
              key={getItemKey(item, index)}
              style={{ height: itemHeight }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const VirtualList = memo(VirtualListInner) as typeof VirtualListInner;

// Virtual grid component
interface VirtualGridProps<T> {
  items: T[];
  rowHeight: number;
  columns: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: number;
  overscan?: number;
  getItemKey: (item: T, index: number) => string | number;
}

function VirtualGridInner<T>({
  items,
  rowHeight,
  columns,
  renderItem,
  className,
  gap = 16,
  overscan = 2,
  getItemKey,
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    setContainerHeight(container.clientHeight);

    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { virtualRows, totalHeight, paddingTop } = useMemo(() => {
    const rows = Math.ceil(items.length / columns);
    const actualRowHeight = rowHeight + gap;

    if (containerHeight === 0) {
      return { virtualRows: [], totalHeight: 0, paddingTop: 0 };
    }

    const startRow = Math.max(0, Math.floor(scrollTop / actualRowHeight) - overscan);
    const visibleRows = Math.ceil(containerHeight / actualRowHeight);
    const endRow = Math.min(rows, startRow + visibleRows + overscan * 2);

    const virtualRows = [];
    for (let row = startRow; row < endRow; row++) {
      const rowItems = [];
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < items.length) {
          rowItems.push({ item: items[index], index });
        }
      }
      virtualRows.push({ row, items: rowItems });
    }

    return {
      virtualRows,
      totalHeight: rows * actualRowHeight - gap,
      paddingTop: startRow * actualRowHeight,
    };
  }, [items, rowHeight, columns, gap, containerHeight, scrollTop, overscan]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn('overflow-auto', className)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${paddingTop}px)` }}>
          {virtualRows.map(({ row, items: rowItems }) => (
            <div
              key={row}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap,
                height: rowHeight,
                marginBottom: gap,
              }}
            >
              {rowItems.map(({ item, index }) => (
                <div key={getItemKey(item, index)}>
                  {renderItem(item, index)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const VirtualGrid = memo(VirtualGridInner) as typeof VirtualGridInner;
