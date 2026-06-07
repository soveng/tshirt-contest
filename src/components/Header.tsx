import { LoginButton } from "./LoginButton";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-edge/70 bg-ink/80 backdrop-blur-md">
      <div className="page-shell flex items-center justify-between gap-3 py-3 sm:py-3.5">
        <a
          href="https://sovereignengineering.io"
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
        </a>
        <LoginButton />
      </div>
    </header>
  );
}
