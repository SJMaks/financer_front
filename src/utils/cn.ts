/** Minimal class-name joiner (keeps Tailwind class strings readable). */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ')
}