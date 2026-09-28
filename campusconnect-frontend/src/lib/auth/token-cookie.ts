/**
 * The auth token is mirrored into a (non-httpOnly) cookie so that:
 *  - Next.js Edge middleware (src/middleware.ts) can see whether the user is
 *    signed in and redirect to /login before rendering protected pages, and
 *  - the session survives a full page reload.
 *
 * The cookie is only a UX hint for routing. The API still verifies the JWT on
 * every request, so a forged or expired cookie cannot access data.
 */
export const AUTH_COOKIE_NAME = 'cc_token';

// Matches the API's JWT lifetime (TOKEN_EXPIRATION_SECONDS in auth.service.js).
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60;

const isBrowser = () => typeof document !== 'undefined';

export const readTokenCookie = (): string | null => {
  if (!isBrowser()) return null;
  const match = document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.slice(AUTH_COOKIE_NAME.length + 1)) : null;
};

export const writeTokenCookie = (token: string) => {
  if (!isBrowser()) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
};

export const clearTokenCookie = () => {
  if (!isBrowser()) return;
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
};
