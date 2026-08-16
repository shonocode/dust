import { useState } from "react";

// img with the phosphor-green CRT tint and a themed fallback for the
// occasional dead FBI image URL.
export function CrtImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center min-h-48 border border-green-500/30 bg-green-900/10 text-green-700 tracking-widest ${className}`}
      >
        [ NO SIGNAL ]
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`crt-image ${className}`}
    />
  );
}
