export function invariant<T extends unknown>(
  condition: T,
  message: string
): asserts condition is NonNullable<T> {
  if (!condition) {
    // TODO: rewrite
    throw new Error(message)
  }
}
