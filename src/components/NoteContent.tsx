import { getDisplayName } from "applesauce-core/helpers";
import type { Mention } from "applesauce-content/nast";
import { useRenderedContent, type ComponentMap } from "applesauce-react/hooks";

import { useProfile } from "../hooks";

function pubkeyFromMention(decoded: Mention["decoded"]): string | undefined {
  if (decoded.type === "npub") return decoded.data;
  if (decoded.type === "nprofile") return decoded.data.pubkey;
  return undefined;
}

function NostrMention({ node }: { node: Mention }) {
  const pubkey = pubkeyFromMention(node.decoded);
  const profile = useProfile(pubkey);
  const href = `https://njump.me/${node.encoded}`;

  if (pubkey) {
    const name = getDisplayName(profile) || `${pubkey.slice(0, 8)}…`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="break-words text-neutral-200 underline-offset-4 [overflow-wrap:anywhere] hover:text-flame hover:underline"
      >
        @{name}
      </a>
    );
  }

  const label =
    node.decoded.type === "note" || node.decoded.type === "nevent" ? "note" : "nostr link";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="break-words font-mono text-neutral-300 underline-offset-4 [overflow-wrap:anywhere] hover:text-flame hover:underline"
    >
      {label}
    </a>
  );
}

const components: ComponentMap = {
  text: ({ node }) => <span>{node.value}</span>,
  link: ({ node }) => (
    <a
      href={node.href}
      target="_blank"
      rel="noreferrer"
      className="break-words text-neutral-200 underline-offset-4 [overflow-wrap:anywhere] hover:text-flame hover:underline"
    >
      {node.value}
    </a>
  ),
  mention: ({ node }) => <NostrMention node={node} />,
  hashtag: ({ node }) => {
    const tag = node.hashtag;
    const href = tag === "soveng" ? "https://ants.sh/t/SovEng" : `https://ants.sh/t/${tag}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="break-words font-mono text-neutral-200 underline-offset-4 [overflow-wrap:anywhere] hover:text-flame hover:underline"
      >
        #{tag}
      </a>
    );
  },
};

export function NoteContent({ content, maxLength }: { content: string; maxLength?: number }) {
  const rendered = useRenderedContent(content || undefined, components, {
    maxLength,
    cacheKey: null,
  });

  if (!content) return null;

  return (
    <div className="min-w-0 max-w-full text-sm leading-relaxed break-words whitespace-pre-wrap text-muted [overflow-wrap:anywhere]">
      {rendered}
    </div>
  );
}
