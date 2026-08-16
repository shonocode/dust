import type { Route } from "./+types/home";
import { Link } from "react-router";
import styles from "./home.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "D.U.S.T - Home" },
    { name: "description", content: "DUST - Home" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-10 px-4">
      <div className="flex flex-col items-center text-center max-w-full">
        <h1 className="text-6xl sm:text-8xl font-bold mb-4">D.U.S.T</h1>
        {/* typewriter is nowrap, so it must shrink instead of wrapping */}
        <p className={`text-sm sm:text-lg max-w-full ${styles.typewriter}`}>
          Digital Undercover Surveillance Terminal
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Link to="/suspects" className={`text-2xl ${styles["crt-link"]}`}>
          Suspects
        </Link>
        {/* hidden until a real api.data.gov key is configured; DEMO_KEY's
            ~10 req/hour limit makes the page look broken to visitors */}
        {import.meta.env.VITE_DATA_GOV_API_KEY && (
          <Link to="/stats" className={`text-2xl ${styles["crt-link"]}`}>
            Crime Stats
          </Link>
        )}
      </div>
    </div>
  );
}
