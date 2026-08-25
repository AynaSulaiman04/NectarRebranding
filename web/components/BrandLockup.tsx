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

  return (
    <svg
      width={size}
      height={size * 1.16}
      viewBox="0 0 48 56"
      fill="none"
      aria-hidden="true"
      className="brandMark"
    >
      {tone === "gradient" && (
        <defs>
          <linearGradient id="nectarMark" x1="14" y1="2" x2="30" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--amber)" />
            <stop offset=".45" stopColor="var(--brick)" />
            <stop offset="1" stopColor="var(--ink)" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M30.4 2c-1.7 0-2.8 1-3.6 2.7C21 15.4 12 30.6 7 39.6 3 46.8 1 51.6 1 54.4h9.2c0-2 1.4-5.7 4.1-10.6C18.6 36 25.4 23 29.3 15c.4-.8.8-1.2 1.2-1.2s.8.4 1 1.2l5.9 30.2c.3 1.6.4 2.7.4 3.5 0 2.7-1.6 3.7-4.7 3.7-2 0-3.7-.4-5.1-1.2l-2 6.5c2.4 1 5.1 1.6 8.1 1.6 7.1 0 11.6-3.7 11.6-10.2 0-1.6-.2-3.4-.6-5.5L36.9 5.7C36.3 3 34.3 2 31.9 2z"
        fill={fill}
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
