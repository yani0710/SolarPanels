export function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function friendlyError(message: string) {
  return message || 'Нещо не се получи. Опитайте отново след момент.';
}
