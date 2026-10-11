export function formatPrice(price: number): string {
  if (isNaN(price)) return '₹0';
  return `₹${Math.round(price).toLocaleString('en-IN')}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
