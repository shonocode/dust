// Shared fetch wrapper: failures throw so <Await errorElement> and route
// error boundaries catch them. `messageFor` lets callers attach a
// user-facing explanation per status code.
export async function fetchJson<T>(
  url: string,
  messageFor?: (status: number) => string
): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      messageFor?.(res.status) ?? `Request failed (HTTP ${res.status})`
    );
  }
  return res.json();
}
