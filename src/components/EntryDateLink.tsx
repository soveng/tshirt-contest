import { nip19 } from "nostr-tools";

import type { Submission } from "../types";

export function formatSubmissionDate(unixSeconds: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(unixSeconds * 1000));
}

export function EntryDateLink({
  submission,
  compact = false,
}: {
  submission: Submission;
  compact?: boolean;
}) {
  const nevent = nip19.neventEncode({ id: submission.id, author: submission.pubkey });

  return (
    <a
      href={`https://njump.to/${nevent}`}
      target="_blank"
      rel="noreferrer"
      className={
        compact
          ? "inline-flex shrink-0 items-center gap-1 font-mono text-[10px] text-muted transition-colors hover:text-flame"
          : "inline-flex items-baseline gap-1 font-mono text-xs leading-none text-flame/50 transition-colors hover:text-flame sm:text-sm"
      }
    >
      {formatSubmissionDate(submission.createdAt)}
      <span aria-hidden>↗</span>
    </a>
  );
}
