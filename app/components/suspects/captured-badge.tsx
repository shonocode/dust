import type { FBISuspect } from "~/types/fbi-wanted";

// Single owner of both the status check and the badge styling, so the
// card grid and the detail page can never disagree.
export function CapturedBadge({
  suspect,
  className = "",
}: {
  suspect: FBISuspect;
  className?: string;
}) {
  if (suspect.status !== "captured") return null;
  return (
    <span
      className={`px-2 py-1 border-2 border-green-300 text-green-300 font-bold ${className}`}
    >
      CAPTURED
    </span>
  );
}
