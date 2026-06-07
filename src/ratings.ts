import type { NostrEvent } from "nostr-tools";

import { accounts, eventStore, pool } from "./nostr";
import { CONTEST, HASHTAG, JUDGE_SET, RATING_NAMESPACE, RELAYS } from "./config";
import type { JudgeRating, Submission, SubmissionScore } from "./types";

/** Parse a kind-1985 label event into a rating, or null if it isn't a valid judge rating */
export function parseRating(event: NostrEvent): JudgeRating | null {
  if (event.kind !== 1985) return null;
  if (!JUDGE_SET.has(event.pubkey)) return null;

  const scoped = event.tags.some((t) => t[0] === "L" && t[1] === RATING_NAMESPACE);
  if (!scoped) return null;

  const label = event.tags.find((t) => t[0] === "l" && t[2] === RATING_NAMESPACE);
  const submissionId = event.tags.find((t) => t[0] === "e")?.[1];
  if (!label || !submissionId) return null;

  const stars = Number(label[1]);
  if (!Number.isInteger(stars) || stars < CONTEST.minRating || stars > CONTEST.maxRating) return null;

  return { judge: event.pubkey, submissionId, stars, createdAt: event.created_at };
}

/** Reduce rating events into a per-submission score, keeping only each judge's latest rating */
export function scoreSubmissions(ratingEvents: NostrEvent[]): Map<string, SubmissionScore> {
  const latest = new Map<string, JudgeRating>();
  for (const event of ratingEvents) {
    const rating = parseRating(event);
    if (!rating) continue;
    const key = `${rating.submissionId}:${rating.judge}`;
    const prev = latest.get(key);
    if (!prev || rating.createdAt > prev.createdAt) latest.set(key, rating);
  }

  const scores = new Map<string, SubmissionScore>();
  for (const rating of latest.values()) {
    let score = scores.get(rating.submissionId);
    if (!score) {
      score = { average: null, count: 0, byJudge: {} };
      scores.set(rating.submissionId, score);
    }
    score.byJudge[rating.judge] = rating.stars;
  }

  for (const score of scores.values()) {
    const values = Object.values(score.byJudge);
    score.count = values.length;
    score.average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  }

  return scores;
}

/** Publish a star rating for a submission as a signed NIP-32 label event */
export async function publishRating(submission: Submission, stars: number): Promise<void> {
  const signer = accounts.signer;
  const template = {
    kind: 1985,
    created_at: Math.floor(Date.now() / 1000),
    content: "",
    tags: [
      ["L", RATING_NAMESPACE],
      ["l", String(stars), RATING_NAMESPACE],
      ["e", submission.id],
      ["p", submission.pubkey],
      ["t", HASHTAG],
      ["alt", `Rated a #SovEng t-shirt submission ${stars}/${CONTEST.maxRating}`],
    ],
  };

  const signed = await signer.signEvent(template);
  eventStore.add(signed);
  await pool.publish(RELAYS, signed);
}
