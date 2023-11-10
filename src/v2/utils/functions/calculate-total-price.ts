export function calculateTotalPrice(
  currentPrice: number,
  discount: number,
  amount: number,
) {
  return (currentPrice - currentPrice * (discount / 100)) * amount;
}
