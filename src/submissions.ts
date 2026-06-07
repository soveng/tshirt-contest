import type { NostrEvent } from "nostr-tools";
import type { Submission } from "./types";

const IMAGE_URL = /https?:\/\/[^\s"'<>]+\.(?:png|jpe?g|gif|webp|avif)(?:\?[^\s"'<>]*)?/gi;

/** Pull image URLs from NIP-92 imeta tags and from the note content */
function extractImages(event: NostrEvent): string[] {
  const urls = new Set<string>();

  for (const tag of event.tags) {
    if (tag[0] === "imeta") {
      for (const part of tag.slice(1)) {
        if (part.startsWith("url ")) urls.add(part.slice(4).trim());
      }
    }
    if (tag[0] === "r" && tag[1] && IMAGE_URL.test(tag[1])) urls.add(tag[1]);
  }

  const matches = event.content.match(IMAGE_URL);
  if (matches) for (const url of matches) urls.add(url);

  return [...urls];
}

/** Turn a raw note into a Submission, or null if it has no image */
export function toSubmission(event: NostrEvent): Submission | null {
  const images = extractImages(event);
  if (images.length === 0) return null;

  return {
    id: event.id,
    pubkey: event.pubkey,
    createdAt: event.created_at,
    content: event.content,
    images,
    event,
  };
}
