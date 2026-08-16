import { Link } from "react-router";
import type { FBISuspect } from "~/types/fbi-wanted";
import { CrtImage } from "~/components/crt-image";
import { CapturedBadge } from "~/components/suspects/captured-badge";

export function SuspectCard({ suspect }: { suspect: FBISuspect }) {
  return (
    <Link to={`/suspects/${suspect.uid}`}>
      <div className="relative border border-green-500/30 bg-green-900/10 rounded-xl p-4 hover:bg-green-300/20 transition shadow-lg">
        <CapturedBadge
          suspect={suspect}
          className="absolute top-6 right-6 z-10 rotate-12 bg-black/60"
        />
        {suspect.images?.[0]?.original && (
          <CrtImage
            src={suspect.images[0].original}
            alt={suspect.title}
            className="w-full h-48 object-cover mb-3 rounded-md"
          />
        )}
        <h2 className="text-xl font-bold truncate mb-1 text-green-200">
          {suspect.title}
        </h2>
        {suspect.reward_text && (
          <p className="text-sm text-green-300 line-clamp-1 mb-1">
            {suspect.reward_text}
          </p>
        )}
        <p className="text-sm line-clamp-2">
          {suspect.description || "No description available."}
        </p>
      </div>
    </Link>
  );
}
