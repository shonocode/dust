import type { Route } from "./+types/home";

import { Suspense } from "react";
import { useLoaderData, Await } from "react-router";
import { fetchSuspects } from "~/lib/fbi-api";
import { SuspectCard } from "~/components/suspects/suspect-card";
import { SuspectFilter } from "~/components/suspects/suspect-filter";
import { CategoryTabs } from "~/components/suspects/category-tabs";
import { Pagination } from "~/components/suspects/pagination";
import { AwaitError } from "~/components/await-error";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "D.U.S.T - Suspects" },
    { name: "description", content: "DUST - Suspects" },
  ];
}

// Deliberately not awaited: the promise streams to <Await> so the page
// shell renders immediately while the FBI API responds.
export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  return { suspects: fetchSuspects(url.searchParams) };
}

export default function Home() {
  const { suspects } = useLoaderData<typeof clientLoader>();

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl mb-6 border-b pb-2">SUSPECTS</h1>
      <CategoryTabs />
      <SuspectFilter />
      <Suspense fallback={<p>Loading…</p>}>
        <Await
          resolve={suspects}
          errorElement={<AwaitError fallback="Error loading suspects." />}
        >
          {({ total, page, items }) =>
            items.length === 0 ? (
              <p className="mt-6">NO RECORDS FOUND.</p>
            ) : (
              <>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <SuspectCard suspect={s} key={s.uid} />
                  ))}
                </div>
                <Pagination currentPage={page} totalItems={total} />
              </>
            )
          }
        </Await>
      </Suspense>
    </div>
  );
}
