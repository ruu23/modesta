import { ClosetItem } from '@/types/closet';
import { CalendarEvent } from '@/types/calendar';

// CSV Export
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');
  
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

// JSON Export
export function exportToJSON(data: unknown, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

// iCal Export
export function exportToICal(events: CalendarEvent[], filename: string): void {
  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Modesta//Closet Calendar//EN',
    ...events.map(event => [
      'BEGIN:VEVENT',
      `UID:${event.id}@modesta`,
      `DTSTART:${formatICalDate(new Date(event.date))}`,
      `SUMMARY:${event.title}`,
      event.notes ? `DESCRIPTION:${event.notes}` : '',
      'END:VEVENT'
    ].filter(Boolean).join('\n')),
    'END:VCALENDAR'
  ].join('\n');
  
  downloadFile(icalContent, `${filename}.ics`, 'text/calendar');
}

function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// Download helper
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Format closet items for export
export function formatClosetItemsForExport(
  items: ClosetItem[], 
  detailLevel: 'full' | 'summary'
): Record<string, unknown>[] {
  return items.map(item => {
    if (detailLevel === 'summary') {
      return {
        name: item.name,
        brand: item.brand,
        category: item.category,
        price: item.price,
        wornCount: item.wornCount,
      };
    }
    return {
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      colors: item.colors.join(', '),
      size: item.size,
      price: item.price,
      purchaseDate: item.purchaseDate,
      wornCount: item.wornCount,
      lastWorn: item.lastWorn,
    };
  });
}

// Generate shareable link (mock)
export function generateShareableLink(type: string, id?: string): string {
  const baseUrl = window.location.origin;
  const shareId = id || Math.random().toString(36).substring(7);
  return `${baseUrl}/share/${type}/${shareId}`;
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Create print-friendly version
export function openPrintView(content: string, title: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .item { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .item h3 { margin: 0 0 10px 0; }
            .item p { margin: 5px 0; color: #666; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${content}
          <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
            Print
          </button>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
