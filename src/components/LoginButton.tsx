import { useState } from "react";

import { loginWithExtension, logout } from "../nostr";
import { useActiveAccount, useIsJudge } from "../hooks";
import { Author } from "./Author";

export function LoginButton() {
  const account = useActiveAccount();
  const isJudge = useIsJudge();
  const [error, setError] = useState<string | null>(null);

  async function connect() {
    setError(null);
    try {
      await loginWithExtension();
    } catch {
      setError("No Nostr extension found");
    }
  }

  if (account) {
    return (
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex min-w-0 max-w-[42vw] items-center gap-2 sm:max-w-none">
          <Author pubkey={account.pubkey} size={26} />
          <span
            className={`hidden rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase sm:inline ${
              isJudge ? "bg-flame/15 text-flame" : "bg-panel-2 text-muted"
            }`}
          >
            {isJudge ? "Judge" : "Spectator"}
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex shrink-0 cursor-pointer items-center rounded-lg border border-edge px-3.5 py-2 text-sm leading-none text-muted transition-colors hover:border-neutral-600 hover:text-neutral-200"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={connect}
        className="cursor-pointer rounded-lg bg-flame px-3.5 py-1.5 text-sm font-semibold leading-none text-ink transition-transform hover:scale-105"
      >
        Login to judge
      </button>
      {error && <span className="font-mono text-[11px] text-flame-soft">{error}</span>}
    </div>
  );
}
