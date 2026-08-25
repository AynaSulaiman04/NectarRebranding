/**
 * Nectar brand lockup: mark + wordmark.
 *
 * The wordmark is set live in Instrument Serif with the tracking the client
 * specified, so it stays crisp at any size and matches the site's display face.
 *
 * The MARK is an approximation drawn from the supplied artwork — the real
 * vector has not been added to the repo yet. Drop `nectar-mark.svg` into
 * `public/` and swap `<Mark/>` for it when it arrives.
 */

type Tone = "gradient" | "ink" | "light";

function Mark({ size = 26, tone = "gradient" }: { size?: number; tone?: Tone }) {
  const fill =
    tone === "gradient"
      ? "url(#nectarMark)"
      : tone === "light"
        ? "var(--almond)"
        : "var(--ink)";

  const right =
    tone === "gradient" ? "url(#nectarMarkB)" : fill;

  return (
    <svg
      width={size * 1.15}
      height={size}
      viewBox="0 0 64 56"
      fill="none"
      aria-hidden="true"
      className="brandMark"
    >
      {tone === "gradient" && (
        <defs>
          <linearGradient id="nectarMark" x1="6" y1="52" x2="30" y2="6" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--error)" />
            <stop offset="1" stopColor="var(--brick)" />
          </linearGradient>
          <linearGradient id="nectarMarkB" x1="58" y1="52" x2="34" y2="6" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--brick)" />
            <stop offset="1" stopColor="var(--amber)" />
          </linearGradient>
        </defs>
      )}
      {/* two leaning strokes meeting at the foot */}
      <path
        d="M30.6 53.2h-8.1l-.7-6.1c-2.4 4.4-6.1 6.8-10.6 6.8C5.4 53.9 1 49.6 1 42.6 1 32.4 9.2 24.6 22.4 24.6h.9l-.3-2.4C22.4 15.9 26 8 30 2.6z"
        fill={fill}
      />
      <path
        d="M33.4 2.8h8.1l.7 6.1c2.4-4.4 6.1-6.8 10.6-6.8C58.6 2.1 63 6.4 63 13.4c0 10.2-8.2 18-21.4 18h-.9l.3 2.4c.6 6.3-3 14.2-7 19.6z"
        fill={right}
      />
    </svg>
  );
}

export default function BrandLockup({
  size = 26,
  tone = "gradient",
  suffix = true,
}: {
  size?: number;
  tone?: Tone;
  suffix?: boolean;
}) {
  return (
    <span className="lockup" data-tone={tone}>
      <Mark size={size} tone={tone} />
      <span className="lockup__type">
        <span className="lockup__name">Nectar</span>
        {suffix && <span className="lockup__suffix">Consultancy</span>}
      </span>
    </span>
  );
}

export { Mark };
