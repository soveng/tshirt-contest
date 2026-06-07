# SovEng T-Shirt Contest — Judging

A small web app for judging the [SEC-08 #SovEng t-shirt design contest](https://sovereignengineering.io/contest).

Entries are pulled from Nostr: a note counts as an entry once the official
[@SovereignEngineering](https://njump.me/npub1s0veng2gvfwr62acrxhnqexq76sj6ldg3a5t935jy8e6w3shr5vsnwrmq5)
account replies to it with an acknowledgement. The four contest judges sign in
with a NIP-07 extension and rate each entry from one to five stars. Ratings are
published as signed NIP-32 label events, and entries are ranked by their average
judge score.

Built with [applesauce](https://applesauce.build), React, and Tailwind.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Judges, relays, and the rating namespace live in `src/config.ts`.
