export function isTestEnv(): boolean {
  if (typeof window === 'undefined') return false;
  // Allow bypassing via env var (for local dev) or 'test' in URL
  if (process.env.NEXT_PUBLIC_BYPASS_COUNTDOWN === 'true') return true;
  return window.location.href.includes('test');
}

export function dayHasCome(weddingDate: Date): boolean {
  const now = new Date();
  return now >= weddingDate;
}

export function shouldShowForm(formEndingDate?: string): boolean {
  if (!formEndingDate) return true;
  if (isTestEnv()) return true;
  
  const endingDate = new Date(formEndingDate);
  const now = new Date();
  return now < endingDate;
}

export function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatTimeRange(start: string, end: string): string {
  return `${start}–${end}`;
}
