export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
};
