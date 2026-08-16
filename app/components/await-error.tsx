import { useAsyncError } from "react-router";

// errorElement for <Await>: shows the real thrown message (e.g. the
// rate-limit explanation from cde-api) instead of a generic string.
export function AwaitError({ fallback }: { fallback: string }) {
  const error = useAsyncError();
  const message = error instanceof Error ? error.message : fallback;
  return <p className="border-2 border-green-300 p-2 inline-block">⚠ {message}</p>;
}
