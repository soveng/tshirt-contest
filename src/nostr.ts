import { EventStore } from "applesauce-core";
import { createEventLoaderForStore } from "applesauce-loaders/loaders";
import { onlyEvents, RelayPool } from "applesauce-relay";
import { AccountManager } from "applesauce-accounts";
import { ExtensionAccount, registerCommonAccountTypes } from "applesauce-accounts/accounts";

import {
  CONTEST_SINCE,
  EXTRA_ENTRY_IDS,
  JUDGE_PUBKEYS,
  LOOKUP_RELAYS,
  OFFICIAL_PUBKEY,
  RATING_NAMESPACE,
  RELAYS,
} from "./config";
import { acknowledgedSubmissionId } from "./submissions";

/** Single shared event store for the whole app */
export const eventStore = new EventStore();

/** Single shared relay pool */
export const pool = new RelayPool();

/** Auto-load missing events (profiles, replies) when a model asks for them */
createEventLoaderForStore(eventStore, pool, {
  lookupRelays: LOOKUP_RELAYS,
});

/** Account manager handles login/active account across signer types */
export const accounts = new AccountManager();
registerCommonAccountTypes(accounts);

const ACCOUNTS_KEY = "soveng:accounts";
const ACTIVE_KEY = "soveng:active";

// Restore saved accounts and the active one (extension signers re-bind to window.nostr lazily)
try {
  const stored = localStorage.getItem(ACCOUNTS_KEY);
  if (stored) accounts.fromJSON(JSON.parse(stored));
  const activeId = localStorage.getItem(ACTIVE_KEY);
  if (activeId) accounts.setActive(activeId);
} catch {
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(ACTIVE_KEY);
}

// Persist accounts and the active selection whenever they change
accounts.accounts$.subscribe(() =>
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts.toJSON())),
);
accounts.active$.subscribe((account) => {
  if (account) localStorage.setItem(ACTIVE_KEY, account.id);
  else localStorage.removeItem(ACTIVE_KEY);
});

/** Log in with a NIP-07 browser extension and make it the active account */
export async function loginWithExtension(): Promise<void> {
  const account = await ExtensionAccount.fromExtension();
  const existing = accounts.accounts.find((a) => a.pubkey === account.pubkey);
  if (existing) {
    accounts.setActive(existing);
  } else {
    accounts.addAccount(account);
    accounts.setActive(account);
  }
}

/** Drop the active account */
export function logout(): void {
  const active = accounts.active;
  accounts.clearActive();
  if (active) accounts.removeAccount(active);
}

/**
 * Subscribe to contest entries and pipe them into the store:
 * - acknowledgement notes from the official account confirm which notes are entries
 * - each acknowledged entry note is loaded on demand
 */
export function startEntryIngest(): () => void {
  const requested = new Set<string>();
  const entryLoaders = new Map<string, { unsubscribe(): void }>();

  const loadEntry = (id: string) => {
    if (requested.has(id)) return;
    requested.add(id);
    entryLoaders.set(
      id,
      pool.request(RELAYS, { ids: [id] }).subscribe((entry) => eventStore.add(entry)),
    );
  };

  // Always load the manually allowlisted entries
  for (const id of EXTRA_ENTRY_IDS) loadEntry(id);

  const acks = pool
    .subscription(RELAYS, { kinds: [1], authors: [OFFICIAL_PUBKEY], since: CONTEST_SINCE })
    .pipe(onlyEvents())
    .subscribe((event) => {
      eventStore.add(event);
      const id = acknowledgedSubmissionId(event);
      // Fetch the entry note from the contest relays (it isn't on the lookup relays)
      if (id) loadEntry(id);
    });

  return () => {
    acks.unsubscribe();
    for (const sub of entryLoaders.values()) sub.unsubscribe();
  };
}

/** Load judge rating events — only needed on /judges, not the public gallery. */
export function startRatingsIngest(): () => void {
  const ratings = pool
    .subscription(RELAYS, {
      kinds: [1985],
      authors: JUDGE_PUBKEYS,
      "#L": [RATING_NAMESPACE],
    })
    .pipe(onlyEvents())
    .subscribe((event) => eventStore.add(event));

  return () => ratings.unsubscribe();
}
