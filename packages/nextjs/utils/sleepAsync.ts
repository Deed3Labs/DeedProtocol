export function sleepAsync(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
