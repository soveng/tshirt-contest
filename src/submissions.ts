import type { NostrEvent } from "nostr-tools";
import { ANNOUNCEMENT_ID, OFFICIAL_PUBKEY } from "./config";
import type { Submission } from "./types";

const IMAGE_URL = /https?:\/\/[^\s"'<>]+\.(?:png|jpe?g|gif|webp|avif)(?:\?[^\s"'<>]*)?/gi;

/** Language the official account uses when confirming an entry */
const ACK_RE = /submi(?:t|ssion)/i;

/** Pull image URLs from NIP-92 imeta tags and from the note content */
function extractImages(event: NostrEvent): string[] {
  const urls = new Set<string>();

  for (const tag of event.tags) {
    if (tag[0] === "imeta") {
      for (const part of tag.slice(1)) {
        if (part.startsWith("url ")) urls.add(part.slice(4).trim());
      }
    }
    if (tag[0] === "r" && tag[1] && new RegExp(IMAGE_URL.source, "i").test(tag[1])) urls.add(tag[1]);
  }

  const matches = event.content.match(IMAGE_URL);
  if (matches) for (const url of matches) urls.add(url);

  return [...urls];
}

/**
 * If an official-account note acknowledges an entry, return the id of the
 * submission note it is replying to. Otherwise null.
 */
export function acknowledgedSubmissionId(reply: NostrEvent): string | null {
  if (!ACK_RE.test(reply.content)) return null;

  // A real acknowledgement tags the submitter (someone other than the official account)
  const tagsSubmitter = reply.tags.some((t) => t[0] === "p" && t[1] && t[1] !== OFFICIAL_PUBKEY);
  if (!tagsSubmitter) return null;

  // The entry is the replied-to note, never the announcement the thread roots from
  const eTags = reply.tags.filter((t) => t[0] === "e" && t[1] && t[1] !== ANNOUNCEMENT_ID);
  if (eTags.length === 0) return null;

  const replyTag = eTags.find((t) => t[3] === "reply");
  const rootTag = eTags.find((t) => t[3] === "root");
  const chosen = replyTag ?? rootTag ?? eTags[eTags.length - 1];
  return chosen[1];
}

/** Turn a confirmed entry note into a Submission */
export function toSubmission(event: NostrEvent): Submission {
  return {
    id: event.id,
    pubkey: event.pubkey,
    createdAt: event.created_at,
    content: event.content,
    images: extractImages(event),
    event,
  };
}
