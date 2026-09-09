export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function publicUrl(username: string) {
  const base = APP_URL.replace(/\/$/, "");
  return `${base}/${username}`;
}

export function displayUrl(username: string) {
  try {
    const host = new URL(APP_URL).host;
    return `${host}/${username}`;
  } catch {
    return `qubelinx.com/${username}`;
  }
}

export function greetingForNow(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
