import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useActiveAccount } from "../hooks";
import { loginWithExtension } from "../nostr";

const navLink =
  "font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-flame hover:underline sm:text-sm";

export function JudgeLoginLink() {
  const account = useActiveAccount();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (account) {
      navigate("/judges");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await loginWithExtension();
      navigate("/judges");
    } catch {
      setError("No Nostr extension found");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-0.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={`${navLink} cursor-pointer disabled:cursor-wait disabled:opacity-60`}
      >
        {busy ? "…" : <><span className="sm:hidden">Judge</span><span className="hidden sm:inline">Login to judge</span></>}
      </button>
      {error && <span className="font-mono text-[11px] text-flame-soft">{error}</span>}
    </div>
  );
}
