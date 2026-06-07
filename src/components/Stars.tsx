import { useState } from "react";
import { CONTEST } from "../config";

function Star({ fill, size }: { fill: number; size: number }) {
  const id = `star-${Math.random().toString(36).slice(2)}`;
  const clamped = Math.max(0, Math.min(1, fill));
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${clamped * 100}%`} stopColor="var(--color-flame)" />
          <stop offset={`${clamped * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.3l6.5-.9L12 2.5z"
        fill={`url(#${id})`}
        stroke="var(--color-edge)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Read-only display of an average rating */
export function StarsDisplay({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: CONTEST.maxRating }, (_, i) => (
        <Star key={i} size={size} fill={value - i} />
      ))}
    </div>
  );
}

/** Interactive star picker for a judge to cast or change a rating */
export function StarsInput({
  value,
  onRate,
  disabled,
  size = 30,
}: {
  value: number;
  onRate: (stars: number) => void;
  disabled?: boolean;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {Array.from({ length: CONTEST.maxRating }, (_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onMouseEnter={() => setHover(star)}
            onClick={() => onRate(star)}
            className="cursor-pointer rounded-md p-0.5 transition-transform hover:scale-115 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
          >
            <Star size={size} fill={shown >= star ? 1 : 0} />
          </button>
        );
      })}
    </div>
  );
}
