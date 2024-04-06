export function generateEightDigitNumber(): string {
  // Generate a random number between 10000000 (minimum 8-digit number) and 99999999 (maximum 8-digit number)
  const min = 10000000;
  const max = 99999999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}
