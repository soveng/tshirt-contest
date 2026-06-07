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

export function EntryDateLink({ submission }: { submission: Submission }) {
  const nevent = nip19.neventEncode({ id: submission.id, author: submission.pubkey });

  return (
    <div className="flex items-baseline gap-1.5 font-mono text-xs leading-none text-flame/50 sm:text-sm">
      <span>{formatSubmissionDate(submission.createdAt)}</span>
      <a
        href={`https://njump.me/${nevent}`}
        target="_blank"
        rel="noreferrer"
        aria-label="View on njump"
        className="text-muted transition-colors hover:text-flame"
      >
        ↗
      </a>
    </div>
  );
}
