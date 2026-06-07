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

/** Fast lookup for "is this pubkey a judge" */
export const JUDGE_SET = new Set(JUDGE_PUBKEYS);

export const CONTEST = {
  title: "SEC-08 T-Shirt Design Contest",
  deadline: "June 15",
  brief: "https://sovereignengineering.io/contest",
  minRating: 1,
  maxRating: 5,
};
