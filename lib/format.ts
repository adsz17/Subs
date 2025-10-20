export function formatMoney(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount / 100);
  } catch (error) {
    if (error instanceof RangeError) {
      return `${(amount / 100).toFixed(2)} ${currency}`;
    }

    throw error;
  }
}
