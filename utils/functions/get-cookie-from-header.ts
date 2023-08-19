export function getCookieFromHeader(header: Headers) {
  return [...header['set-cookie']];
}
