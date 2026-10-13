const TOKEN_KEY = 'financer.jwt'

/** Persists the JWT on the client so authentication survives page reloads. */
export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },
  remove(): void {
    localStorage.removeItem(TOKEN_KEY)
  },
}