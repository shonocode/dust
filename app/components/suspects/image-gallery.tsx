import { useMemo, useState } from "react";
import type { FBIImage } from "~/types/fbi-wanted";
import { CrtImage } from "~/components/crt-image";

// NOTE: the parent renders this with key={suspect.uid}, which remounts the
// gallery (resetting currentIndex) when navigating between suspects. That
// key is load-bearing — without it a stale index would leak across records.
export default function ImageGallery({ images }: { images: FBIImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = useMemo(
    () => images.filter((image) => image.original),
    [images]
  );

  if (validImages.length === 0) {
    return null;
  }

  const current = validImages[currentIndex];

  const goTo = (step: number) => {
    setCurrentIndex(
      (currentIndex + step + validImages.length) % validImages.length
    );
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        {/* keyed by index, not URL: the feed sometimes repeats a URL */}
        <CrtImage
          key={currentIndex}
          src={current.original!}
          alt={
            current.caption ??
            `Photo ${currentIndex + 1} of ${validImages.length}`
          }
          className="w-full rounded-md"
        />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => goTo(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-4xl sm:text-6xl"
            >
              &lt;
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={() => goTo(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-4xl sm:text-6xl"
            >
              &gt;
            </button>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="flex justify-center mt-2 gap-1">
          {validImages.map((_, i) => (
            <button
              type="button"
              key={i}
              aria-label={`Go to image ${i + 1}`}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full ${
                i === currentIndex ? "bg-green-300" : "bg-green-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
