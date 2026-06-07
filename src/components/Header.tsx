import { Link } from "react-router-dom";

import { LoginButton } from "./LoginButton";

const navLink =
  "font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-flame hover:underline sm:text-sm";

export function Header({ mode }: { mode: "gallery" | "judges" }) {
  return (
    <header className="sticky top-0 z-30 border-b border-edge/70 bg-ink/80 backdrop-blur-md">
      <div className="page-shell flex items-center justify-between gap-3 py-3 sm:py-3.5">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 text-neutral-200 transition-colors hover:text-flame"
        >
          <img
            src="/soveng-brandmark.svg"
            alt="Sovereign Engineering"
            width={32}
            height={32}
            className="shrink-0"
          />
          <span className="font-brand truncate text-xs font-bold tracking-wide uppercase sm:text-sm">
            Sovereign Engineering
          </span>
        </Link>

        {mode === "gallery" ? (
          <Link to="/judges" className={navLink}>
            Judge Login
          </Link>
        ) : (
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link to="/" className={navLink}>
              Gallery
            </Link>
            <LoginButton />
          </div>
        )}
      </div>
    </header>
  );
}
