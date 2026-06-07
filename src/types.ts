import type { NostrEvent } from "nostr-tools";

export interface Submission {
  id: string;
  pubkey: string;
  createdAt: number;
  content: string;
  images: string[];
  event: NostrEvent;
}

export interface JudgeRating {
  judge: string;
  submissionId: string;
  stars: number;
  createdAt: number;
}

export interface SubmissionScore {
  /** Mean of the latest rating from each judge, or null if unrated */
  average: number | null;
  /** How many judges have rated */
  count: number;
  /** Latest star value per judge pubkey */
  byJudge: Record<string, number>;
}
