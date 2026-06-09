import type { NostrEvent } from "nostr-tools";
import type { Submission } from "./types";

// Static (non-animated) image formats we display. Gifs are intentionally excluded.
const IMAGE_URL = /https?:\/\/[^\s"'<>]+\.(?:png|jpe?g|webp|avif)(?:\?[^\s"'<>]*)?/gi;

// Any linked media, including gifs and video — used only to scrub raw URLs from note text.
const MEDIA_URL = /https?:\/\/[^\s"'<>]+\.(?:png|jpe?g|gif|webp|avif|mp4|mov|webm|m4v)(?:\?[^\s"'<>]*)?/gi;

const GIF_URL = /\.gif(?:[?#]|$)/i;
const VIDEO_URL = /\.(?:mp4|mov|webm|m4v)(?:[?#]|$)/i;

/** Pull displayable (non-gif, non-video) image URLs from NIP-92 imeta tags and note content */
function extractImages(event: NostrEvent): string[] {
  const urls = new Set<string>();

  for (const tag of event.tags) {
    if (tag[0] === "imeta") {
      for (const part of tag.slice(1)) {
        if (part.startsWith("url ")) {
          const url = part.slice(4).trim();
          if (!GIF_URL.test(url) && !VIDEO_URL.test(url)) urls.add(url);
        }
      }
    }
    if (tag[0] === "r" && tag[1] && new RegExp(IMAGE_URL.source, "i").test(tag[1])) urls.add(tag[1]);
  }

  const matches = event.content.match(IMAGE_URL);
  if (matches) for (const url of matches) urls.add(url);

  return [...urls];
}

/** True if the note links a video anywhere (content, imeta, or r tags) */
export function hasVideo(event: NostrEvent): boolean {
  if (VIDEO_URL.test(event.content)) return true;
  for (const tag of event.tags) {
    if (tag[0] === "imeta" && tag.slice(1).some((part) => VIDEO_URL.test(part))) return true;
    if (tag[0] === "r" && tag[1] && VIDEO_URL.test(tag[1])) return true;
  }
  return false;
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
