/** A saved timestamp as a date and time in the device's locale. */
export function formatLocalDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day}, ${time}`;
}
