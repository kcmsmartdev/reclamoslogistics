export function generateTrackingCode(): string {
  const prefix = 'REC';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${date}-${randomStr}`;
}