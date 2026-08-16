import { Outlet } from "react-router";

export default function Crt() {
  return (
    <main className="min-h-screen relative">
      {/* flicker: a black overlay whose opacity jumps, so only this
          viewport-sized layer animates, not the scrolling content */}
      <div className="fixed inset-0 pointer-events-none z-30 bg-black crt-flicker" />

      {/* scan-line */}
      <div
        className="
          absolute inset-0 pointer-events-none z-10
          bg-[length:100%_4px] bg-gradient-to-b
          from-transparent to-black/25
        "
      />

      {/* vignette */}
      <div
        className="
          absolute inset-0 pointer-events-none z-20
          bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.3)_90%)]
        "
      />

      <Outlet />

      <footer className="p-4 text-center text-sm opacity-70">
        Unofficial app — not affiliated with, approved, or endorsed by the FBI.
        Data from the public{" "}
        <a
          href="https://www.fbi.gov/wanted/api"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          FBI Wanted API
        </a>
        . All individuals are presumed innocent until proven guilty.
      </footer>
    </main>
  );
}
