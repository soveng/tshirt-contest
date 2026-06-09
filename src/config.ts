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
  "wss://nostr.bitcoiner.social/",
  "wss://relay.snort.social/",
  "wss://relay.current.fyi/",
  "wss://index.hzrd149.com/",
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
  "nevent1qqspf4t46uvyvhace5d2tgulu869sedpy52undje0tmz8c5whjm5lss8z9xnw",
  "nevent1qyv8wumn8ghj7un9d3shjtnywfjkzmtfw35zuar09uq32amnwvaz7tmjv4kxz7fwv3sk6atn9e5k7tcpzemhxue69uhhyetvv9ujumt0wd68ytnsw43z7qghwaehxw309aex2mrp0yh8qunfd4skctnwv46z7qgewaehxw309aex2mrp0yhx6mmddaehgu3wwp5ku6e0qyfhwumn8ghj7ur4wfcxcetsv9njuetn9uqsuamnwvaz7tmwdaejumr0dshsz9nhwden5te0wfjkccte9ejxjar5duh8qatz9uqzp67pfc3gn45mhzdlkl47wllz2yqmfep98z9xyfcsl9jjhas4d6ftmnca3s",
];

/**
 * Notes to hide even if the official account acknowledged them by mistake.
 * Add as nevent or note id.
 */
export const EXCLUDED_ENTRY_REFS = [
  "nevent1qgsr3lnm9dfpteq209tgjgzc3dvgd43p0fp4wrpgcz3jud43yghfq8sqyp80whqxxnuez4r8eyc8y6fas88l3e9krst5aqetkqk074qtdug3yvr3rnl",
  "nevent1qgstdp3mrrh5ttnvjjvx6psufgwjf5l8c6hxw7y5ej4r4sy2p8s4vmqqyrk0fejvj7kce2qae3ldyn865dsqsxj0tqxmllf3d34d0tzkysfv55udxp5",
  "nevent1qgsdjyv3uv8qq3ztjskqaqk263ctx2h3w9mycgn4hmstmxfh0m75qagqypcty3rqh6s457q92tfc382tq930dhrnp9qsmd4gqnzne9ww2lyz7u290v4",
  "nevent1qgs22efqy7xhup8dujy0a6ae4kka0jknwvmrjjlf55373ln2xnpk4ncqyrnwtfmfaarpwsds2jt3ckt3cyty8qrxgenat6h60zlkhcqv6zze5naqggm",
  "nevent1qgsxhyetsv4ghqpplw2nszmdwfrtwpjdpdnukg9thjhfrl77rrfvg7sqyqv49avrnm4xcwq08r8tejwj2h6wmfv837z2gltfr5necegwk0p4zfzqdq9",
  "nevent1qgswc7d4dz775c72vzgltwztp33ecy9qjx0pwhaqnfx7x920s2gx7fgqyzzuujl4arurnag24t9vs6qcrtyw6959yc94rmmvkqj2s7zz2nz5s4ltn89",
  "nevent1qgszf5mgc9qwuek4tfhq0t3j9qxny0nrxvthcetgfv0g9m27euqdx9cqyz94e6k6fs67ys895p3nj35czgedrdfssxawme24qn5wf98dneaevp4gqat",
  "nevent1qgsxurmn0quhy9dvykudd2rqawgaa6x9arltlenw4ka99ymw90mf3agqyqhhyxmym06wqcd5cusln36nzlz6n7csee3rspd6tzkw8uxgdeq9j6838a9",
];

function decodeEventId(ref: string): string {
  const decoded = nip19.decode(ref);
  if (decoded.type === "nevent") return decoded.data.id;
  if (decoded.type === "note") return decoded.data;
  throw new Error(`Not an event reference: ${ref}`);
}

export const EXTRA_ENTRY_IDS = EXTRA_ENTRY_REFS.map(decodeEventId);
export const EXCLUDED_ENTRY_IDS = new Set(EXCLUDED_ENTRY_REFS.map(decodeEventId));

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

/** Authors whose own posts never count as entries (official account + organizer) */
export const EXCLUDED_AUTHOR_PUBKEYS = new Set([
  OFFICIAL_PUBKEY,
  decodeNpub("npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc"),
]);

export const CONTEST = {
  title: "SEC-08 T-Shirt Design Contest",
  deadline: "June 15",
  brief: "https://sovereignengineering.io/contest",
  minRating: 1,
  maxRating: 5,
};
