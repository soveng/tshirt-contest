import { LoginButton } from "./LoginButton";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-edge/70 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
        <a href="https://sovereignengineering.io" className="flex items-center gap-2.5">
          <img src="/flame.svg" alt="" width={26} height={26} />
          <span className="font-mono text-[11px] leading-tight font-medium tracking-[0.2em] text-muted uppercase">
            Sovereign
            <br />
            Engineering
          </span>
        </a>
        <LoginButton />
      </div>
    </header>
  );
}
