import { useEffect } from "react";
import type { FBISuspect } from "~/types/fbi-wanted";
import { processHTML, formatRange, formatHeightRange } from "~/lib/format";
import ImageGallery from "~/components/suspects/image-gallery";
import { CapturedBadge } from "~/components/suspects/captured-badge";

export default function SuspectDetail({ suspect }: { suspect: FBISuspect }) {
  // The route's meta() sets a static fallback title; this refines it with
  // the suspect's name once the deferred data resolves. meta() cannot do
  // this itself because the loader intentionally returns an un-awaited
  // promise (see routes/suspects/suspect.tsx).
  useEffect(() => {
    document.title = `D.U.S.T - ${suspect.title}`;
  }, [suspect.title]);

  const age = formatRange(suspect.age_min, suspect.age_max);
  const height = formatHeightRange(suspect.height_min, suspect.height_max);
  const weight = formatRange(suspect.weight_min, suspect.weight_max);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-words">
      {suspect.images && suspect.images.length > 0 && (
        // key resets the gallery's photo index when navigating suspects
        <ImageGallery key={suspect.uid} images={suspect.images} />
      )}

      <div className="border-2 rounded-md p-4">
        <h1 className="text-3xl font-bold mb-2 border-b text-green-200 pb-1">
          {suspect.title}
        </h1>

        <div className="space-y-2">
          <CapturedBadge suspect={suspect} className="inline-block" />

          {suspect.warning_message && (
            <p className="border-2 border-green-300 text-green-200 font-bold p-2">
              ⚠ {suspect.warning_message}
            </p>
          )}

          {suspect.reward_text && (
            <div>
              <h2 className="text-xl font-semibold">REWARD</h2>
              <p className="text-green-200">{suspect.reward_text}</p>
            </div>
          )}

          {suspect.aliases && suspect.aliases.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">ALIASES</h2>
              <p>{suspect.aliases.join(", ")}</p>
            </div>
          )}

          {suspect.description && (
            <div>
              <h2 className="text-xl font-semibold">DESCRIPTION</h2>
              <p>{suspect.description}</p>
            </div>
          )}

          {suspect.caution && (
            <HtmlSection title="CAUTION" html={suspect.caution} />
          )}

          {suspect.remarks && (
            <HtmlSection title="REMARKS" html={suspect.remarks} />
          )}

          {suspect.scars_and_marks && (
            <div>
              <h2 className="text-xl font-semibold">SCARS & MARKS</h2>
              <p>{suspect.scars_and_marks}</p>
            </div>
          )}
        </div>
      </div>

      {suspect.field_offices && suspect.field_offices.length > 0 && (
        <div className="border-2 rounded-md p-4">
          <h2 className="text-xl mb-2 border-b">FIELD OFFICES</h2>
          <TagList tags={suspect.field_offices.map((o) => o.toUpperCase())} />
        </div>
      )}

      <div className="border-2 rounded-md p-4">
        <h2 className="text-xl mb-2 border-b pb-1">BIOMETRIC DATA</h2>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          {suspect.sex && <DataField label="SEX" value={suspect.sex} />}
          {suspect.race && <DataField label="RACE" value={suspect.race} />}
          {age && <DataField label="AGE" value={age} />}
          {height && <DataField label="HEIGHT" value={height} />}
          {weight && <DataField label="WEIGHT" value={`${weight} lbs`} />}
          {suspect.hair && <DataField label="HAIR" value={suspect.hair} />}
          {suspect.eyes && <DataField label="EYES" value={suspect.eyes} />}
          {suspect.complexion && (
            <DataField label="COMPLEXION" value={suspect.complexion} />
          )}
          {suspect.build && <DataField label="BUILD" value={suspect.build} />}
          {suspect.nationality && (
            <DataField label="NATIONALITY" value={suspect.nationality} />
          )}
          {suspect.place_of_birth && (
            <DataField label="BIRTHPLACE" value={suspect.place_of_birth} />
          )}
          {suspect.dates_of_birth_used?.[0] && (
            <DataField
              label="DOB"
              value={suspect.dates_of_birth_used.join(", ")}
              className="col-span-2"
            />
          )}
          {suspect.occupations && suspect.occupations.length > 0 && (
            <DataField
              label="OCCUPATIONS"
              value={suspect.occupations.join(", ")}
              className="col-span-2"
            />
          )}
          {suspect.languages && suspect.languages.length > 0 && (
            <DataField
              label="LANGUAGES"
              value={suspect.languages.join(", ")}
              className="col-span-2"
            />
          )}
        </div>
      </div>

      {((suspect.possible_countries && suspect.possible_countries.length > 0) ||
        (suspect.possible_states && suspect.possible_states.length > 0)) && (
        <div className="border-2 rounded-md p-4">
          <h2 className="text-xl mb-2 border-b">SUSPECTED LOCATIONS</h2>
          {suspect.possible_countries &&
            suspect.possible_countries.length > 0 && (
              <div className="mb-2">
                <h3 className="text-lg font-semibold">COUNTRIES</h3>
                <TagList tags={suspect.possible_countries} />
              </div>
            )}
          {suspect.possible_states && suspect.possible_states.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">STATES</h3>
              <TagList tags={suspect.possible_states} />
            </div>
          )}
        </div>
      )}

      <div className="border-2 rounded-md p-4">
        <h2 className="text-xl mb-2 border-b">SYSTEM REFERENCES</h2>
        <div className="flex flex-col">
          <DataField label="UID" value={suspect.uid} className="break-all" />
          <DataField label="NCIC" value={suspect.ncic || "N/A"} />
          <DataField label="LAST UPDATE" value={suspect.modified || "N/A"} />
          {suspect.files && suspect.files.length > 0 && (
            <div className="mt-2">
              <span className="text-sm">WANTED POSTERS:</span>
              <div className="flex flex-col">
                {suspect.files.map((file) => (
                  <a
                    key={file.url}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {file.name || "Poster"} (PDF)
                  </a>
                ))}
              </div>
            </div>
          )}
          {suspect.url && (
            <a
              href={suspect.url}
              target="_blank"
              rel="noreferrer"
              className="underline mt-2"
            >
              VIEW OFFICIAL FBI RECORD →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function DataField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="text-sm">{label}:</span>{" "}
      <span className="font-medium">{value}</span>
    </div>
  );
}

function HtmlSection({ title, html }: { title: string; html: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: processHTML(html) }} />
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="px-2 py-1 border rounded">
          {tag}
        </span>
      ))}
    </div>
  );
}
