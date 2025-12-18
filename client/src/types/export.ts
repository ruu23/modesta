export type ExportFormat = 'pdf' | 'csv' | 'json' | 'ical' | 'images';
export type ExportQuality = 'high' | 'medium' | 'low';
export type ExportLayout = 'grid' | 'list' | 'cards';

export interface ExportClosetOptions {
  format: 'pdf' | 'csv' | 'json';
  include: 'all' | 'selected' | 'filtered';
  details: 'full' | 'summary';
  includeImages: boolean;
}

export interface ExportOutfitsOptions {
  format: 'pdf' | 'images' | 'json';
  layout: ExportLayout;
  include: 'all' | 'favorites' | 'dateRange';
  quality: ExportQuality;
  watermark: boolean;
  dateRange?: { start: Date; end: Date };
}

export interface ExportCalendarOptions {
  format: 'pdf' | 'ical' | 'csv';
  dateRange: { start: Date; end: Date };
  includeImages: boolean;
  design: 'simple' | 'detailed';
}

export interface ExportDataPackageOptions {
  includeProfile: boolean;
  includePreferences: boolean;
  includeItems: boolean;
  includeOutfits: boolean;
  includeCalendar: boolean;
}

export interface ShareOptions {
  type: 'link' | 'social' | 'email' | 'print';
  platform?: 'instagram' | 'pinterest' | 'twitter';
}

export type ExportTab = 'closet' | 'outfits' | 'calendar' | 'data' | 'share';
