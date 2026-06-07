import { nip19 } from "nostr-tools";

/** The hashtag designers use to submit ("#SovEng" lowercased for the "t" tag) */
export const HASHTAG = "soveng";

/** Relays we read submissions from and publish ratings to */
export const RELAYS = [
  "wss://relay.damus.io/",
  "wss://nos.lol/",
  "wss://relay.primal.net/",
  "wss://relay.nostr.band/",
  "wss://nostr.wine/",
];

/** Relays used to look up profiles and relay lists */
export const LOOKUP_RELAYS = ["wss://purplepag.es/", "wss://index.hzrd149.com/"];

/** NIP-32 label namespace that scopes a rating to this contest */
export const RATING_NAMESPACE = "io.sovereignengineering.tshirt";

/** The official Sovereign Engineering account that acknowledges entries */
export const OFFICIAL_NPUB =
  "npub1s0veng2gvfwr62acrxhnqexq76sj6ldg3a5t935jy8e6w3shr5vsnwrmq5";

/** The contest announcement note; official replies thread off it but it isn't an entry */
export const ANNOUNCEMENT_ID = "2ba7d8b0dfdf550e4a883ac1ac4b1425fa6f514933010a30c1b4e9c79bc536f0";

/**
 * Entries that should be included even without an official acknowledgement
 * (e.g. clear submissions the official account hasn't replied to). Add the
 * note as a nevent or note id.
 */
export const EXTRA_ENTRY_REFS = [
  "nevent1qqsq8tqdyx27al0pkaf85p47s6hgt33wlg202tgh4t3mq33u972s5ucs8he9g",
  "nevent1qqszg2xejhjp3gcgz5hlfd7w2hpw94d4mffj2xgwxjn3dr5lzjx83hqqqdwtd",
];

function decodeEventId(ref: string): string {
  const decoded = nip19.decode(ref);
  if (decoded.type === "nevent") return decoded.data.id;
  if (decoded.type === "note") return decoded.data;
  throw new Error(`Not an event reference: ${ref}`);
}

export const EXTRA_ENTRY_IDS = EXTRA_ENTRY_REFS.map(decodeEventId);

/** Only look at activity from when the contest opened */
export const CONTEST_SINCE = Math.floor(new Date("2026-05-26T00:00:00Z").getTime() / 1000);

/** The five judges, by npub */
export const JUDGE_NPUBS = [
  "npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc",
  "npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft",
  "npub16c9a45p5dr6l3jzmrvgdh9m7xy994tatxd6sm7kmxaygkq4lertsfnacfm",
  "npub1tdc9um9kqfp9cqvjqtwswzsvqzdsgzkpn9swamed3286kfwpaljsrr8r0y",
];

function decodeNpub(npub: string): string {
  const decoded = nip19.decode(npub);
  if (decoded.type !== "npub") throw new Error(`Not an npub: ${npub}`);
  return decoded.data;
}

/** Judge pubkeys in hex */
export const JUDGE_PUBKEYS = JUDGE_NPUBS.map(decodeNpub);

/** Official account pubkey in hex */
export const OFFICIAL_PUBKEY = decodeNpub(OFFICIAL_NPUB);

/** Fast lookup for "is this pubkey a judge" */
export const JUDGE_SET = new Set(JUDGE_PUBKEYS);

export const CONTEST = {
  title: "SEC-08 T-Shirt Design Contest",
  deadline: "June 15",
  brief: "https://sovereignengineering.io/contest",
  minRating: 1,
  maxRating: 5,
};
