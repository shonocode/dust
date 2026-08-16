import type { Route } from "./+types/suspect";

import { Suspense } from "react";
import { useLoaderData, Await } from "react-router";
import { fetchSuspect } from "~/lib/fbi-api";
import SuspectDetail from "~/components/suspects/suspect-detail";
import { AwaitError } from "~/components/await-error";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "D.U.S.T - Suspect" },
    { name: "description", content: "DUST - Suspect" },
  ];
}

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { suspect: fetchSuspect(params.uid) };
}

export default function Suspect() {
  const { suspect } = useLoaderData<typeof clientLoader>();

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl mb-6 border-b pb-2">SUSPECT</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <Await
          resolve={suspect}
          errorElement={<AwaitError fallback="Error loading suspect." />}
        >
          {(resolved) => <SuspectDetail suspect={resolved} />}
        </Await>
      </Suspense>
    </div>
  );
}
