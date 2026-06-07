import { EventStore } from "applesauce-core";
import { createEventLoaderForStore } from "applesauce-loaders/loaders";
import { onlyEvents, RelayPool } from "applesauce-relay";
import { AccountManager } from "applesauce-accounts";
import { ExtensionAccount, registerCommonAccountTypes } from "applesauce-accounts/accounts";

import { HASHTAG, JUDGE_PUBKEYS, LOOKUP_RELAYS, RATING_NAMESPACE, RELAYS } from "./config";

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

const ACTIVE_KEY = "soveng:active-extension";

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
  localStorage.setItem(ACTIVE_KEY, "1");
}

/** Drop the active account */
export function logout(): void {
  const active = accounts.active;
  accounts.clearActive();
  if (active) accounts.removeAccount(active);
  localStorage.removeItem(ACTIVE_KEY);
}

/** Restore an extension login on page load if one was used before */
export async function restoreSession(): Promise<void> {
  if (!localStorage.getItem(ACTIVE_KEY)) return;
  if (typeof window === "undefined" || !("nostr" in window)) return;
  try {
    await loginWithExtension();
  } catch {
    localStorage.removeItem(ACTIVE_KEY);
  }
}

/** Subscribe to contest submissions and judge ratings, piping both into the store */
export function startIngest(): () => void {
  const submissions = pool
    .subscription(RELAYS, { kinds: [1], "#t": [HASHTAG] })
    .pipe(onlyEvents())
    .subscribe((event) => eventStore.add(event));

  const ratings = pool
    .subscription(RELAYS, {
      kinds: [1985],
      authors: JUDGE_PUBKEYS,
      "#L": [RATING_NAMESPACE],
    })
    .pipe(onlyEvents())
    .subscribe((event) => eventStore.add(event));

  return () => {
    submissions.unsubscribe();
    ratings.unsubscribe();
  };
}
