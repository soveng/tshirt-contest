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
    if (tag[0] === "r" && tag[1] && new RegExp(IMAGE_URL.source, "i").test(tag[1])) urls.add(tag[1]);
  }

  const matches = event.content.match(IMAGE_URL);
  if (matches) for (const url of matches) urls.add(url);

  return [...urls];
}

/** Drop image URLs and trailing whitespace from note text shown beside the mockup */
function cleanContent(content: string, imageUrls: readonly string[]): string {
  let text = content;

  for (const url of imageUrls) {
    text = text.replaceAll(url, "");
  }

  text = text.replace(new RegExp(IMAGE_URL.source, IMAGE_URL.flags), "");

  text = text.replace(
    /!\[[^\]]*\]\(\s*https?:\/\/[^\s"'<>)]+\.(?:png|jpe?g|gif|webp|avif)(?:\?[^\s"'<>)]*)?\s*\)/gi,
    "",
  );

  text = text.replace(/^\s+$/gm, "");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trimEnd();
}

/** Turn a confirmed entry note into a Submission */
export function toSubmission(event: NostrEvent): Submission {
  const images = extractImages(event);
  return {
    id: event.id,
    pubkey: event.pubkey,
    createdAt: event.created_at,
    content: cleanContent(event.content, images),
    images,
    event,
  };
}
