import type { NostrEvent } from "nostr-tools";
import type { Submission } from "./types";

// Static (non-animated) image formats we display. Gifs are intentionally excluded.
const IMAGE_URL = /https?:\/\/[^\s"'<>]+\.(?:png|jpe?g|webp|avif)(?:\?[^\s"'<>]*)?/gi;

// Any linked media, including gifs — used only to scrub raw URLs from note text.
const MEDIA_URL = /https?:\/\/[^\s"'<>]+\.(?:png|jpe?g|gif|webp|avif)(?:\?[^\s"'<>]*)?/gi;

const GIF_URL = /\.gif(?:[?#]|$)/i;

/** Pull displayable (non-gif) image URLs from NIP-92 imeta tags and note content */
function extractImages(event: NostrEvent): string[] {
  const urls = new Set<string>();

  for (const tag of event.tags) {
    if (tag[0] === "imeta") {
      for (const part of tag.slice(1)) {
        if (part.startsWith("url ")) {
          const url = part.slice(4).trim();
          if (!GIF_URL.test(url)) urls.add(url);
        }
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

  text = text.replace(new RegExp(MEDIA_URL.source, MEDIA_URL.flags), "");

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
