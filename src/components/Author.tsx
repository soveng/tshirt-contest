import { getDisplayName, getProfilePicture } from "applesauce-core/helpers";
import { nip19 } from "nostr-tools";

import { useProfile } from "../hooks";

function shortNpub(pubkey: string): string {
  const npub = nip19.npubEncode(pubkey);
  return `${npub.slice(0, 10)}…${npub.slice(-4)}`;
}

export function Author({ pubkey, size = 28 }: { pubkey: string; size?: number }) {
  const profile = useProfile(pubkey);
  const name = getDisplayName(profile) || shortNpub(pubkey);
  const picture = getProfilePicture(profile, `https://robohash.org/${pubkey}.png?set=set1`);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <img
        src={picture}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full border border-edge object-cover"
        style={{ width: size, height: size }}
      />
      <span
        className={`truncate font-medium text-neutral-200 ${size <= 20 ? "text-[11px]" : size <= 22 ? "text-xs" : "text-sm"}`}
      >
        {name}
      </span>
    </div>
  );
}

/** Just the avatar, for compact rows like per-judge ratings */
export function AuthorAvatar({ pubkey, size = 24 }: { pubkey: string; size?: number }) {
  const profile = useProfile(pubkey);
  const name = getDisplayName(profile) || shortNpub(pubkey);
  const picture = getProfilePicture(profile, `https://robohash.org/${pubkey}.png?set=set1`);

  return (
    <img
      src={picture}
      alt={name}
      title={name}
      width={size}
      height={size}
      className="rounded-full border border-edge object-cover"
      style={{ width: size, height: size }}
    />
  );
}
