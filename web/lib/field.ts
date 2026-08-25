/**
 * Warped hairline field.
 *
 *   m      1 = straight, evenly spaced lines. As m falls toward 0 every line is
 *          pulled toward the vertical centre, producing the pinched bowtie.
 *          The waist uses v*v so the curve stays smooth through the middle
 *          rather than kinking.
 *   bloom  0 = brick lines on almond. 1 = almond lines over the warm field.
 *
 * The warm field is painted once into an offscreen canvas and composited, so an
 * animating frame only ever redraws strokes.
 *
 * Every colour here is a Section 05 token. Do not introduce another.
 */

const BRICK = [179, 58, 30] as const;
const ALMOND = [251, 246, 239] as const;

export type Field = {
  size: () => void;
  /**
   * @param m      waist. 1 = straight lines, 0 = fully pinched.
   * @param bloom  0 = brick lines on almond, 1 = almond lines over the field.
   * @param reveal 0 = no lines drawn, 1 = all of them. Lines fade in from the
   *               centre outward, so the form materialises rather than cutting in.
   */
  paint: (m: number, bloom: number, reveal?: number) => void;
};

/**
 * "deep" is the launch ground — brick and error dominant.
 * "light" is the hero ground — clay and amber dominant, with a bloom through
 * the middle so ink-coloured display type clears WCAG AA over it.
 */
export type Tone = "deep" | "light";

export function makeField(
  cv: HTMLCanvasElement,
  pitch = 6,
  tone: Tone = "deep",
): Field {
  const ctx = cv.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");

  const bg = document.createElement("canvas");
  const bgx = bg.getContext("2d")!;
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

  let w = 1;
  let h = 1;

  function paintBase() {
    bg.width = Math.round(w * dpr);
    bg.height = Math.round(h * dpr);
    bgx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const r = Math.max(w, h);
    const g = bgx.createLinearGradient(0, 0, w, h);
    if (tone === "light") {
      g.addColorStop(0, "#A8321A"); // error
      g.addColorStop(0.45, "#D9714D"); // clay
      g.addColorStop(1, "#A8321A"); // error
    } else {
      g.addColorStop(0, "#A8321A"); // error
      g.addColorStop(0.52, "#D9714D"); // clay
      g.addColorStop(1, "#B33A1E"); // brick
    }
    bgx.fillStyle = g;
    bgx.fillRect(0, 0, w, h);

    const blooms: [number, number, number, string, number][] =
      tone === "light"
        ? [
            [0.14, 0.58, r * 0.62, "217,113,77", 0.85], // clay, left lift
            [0.9, 0.46, r * 0.5, "168,50,26", 0.8], // error, deep right
            [0.34, 0.02, r * 0.52, "179,58,30", 0.72], // brick, deep top
            [0.72, 0.92, r * 0.46, "232,163,61", 0.5], // amber, lower right warmth
            [0.48, 0.6, r * 0.5, "232,163,61", 0.36], // soft lift behind the type
          ]
        : [
            [0.2, 0.8, r * 0.78, "232,163,61", 0.78], // amber
            [0.86, 0.3, r * 0.62, "179,58,30", 0.9], // brick
            [0.55, 0.04, r * 0.5, "168,50,26", 0.55], // error
          ];
    for (const [x, y, rad, rgb, a] of blooms) {
      const grad = bgx.createRadialGradient(w * x, h * y, 0, w * x, h * y, rad);
      grad.addColorStop(0, `rgba(${rgb},${a})`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      bgx.fillStyle = grad;
      bgx.fillRect(0, 0, w, h);
    }

    if (tone === "light") {
      // Corner falloff, so the field has depth rather than reading as a flat
      // wash. Ink at low alpha — a shade of the palette, not a new colour.
      const vig = bgx.createRadialGradient(
        w * 0.5,
        h * 0.55,
        r * 0.28,
        w * 0.5,
        h * 0.55,
        r * 0.85,
      );
      vig.addColorStop(0, "rgba(42,27,20,0)");
      vig.addColorStop(1, "rgba(42,27,20,.26)");
      bgx.fillStyle = vig;
      bgx.fillRect(0, 0, w, h);
    }
  }

  function size() {
    const rect = cv.getBoundingClientRect();
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBase();
  }

  /** brick -> almond as the field blooms in */
  function lineRGB(bloom: number) {
    const mix = (a: number, b: number) => Math.round(a + (b - a) * bloom);
    return `${mix(BRICK[0], ALMOND[0])},${mix(BRICK[1], ALMOND[1])},${mix(BRICK[2], ALMOND[2])}`;
  }

  function paint(m: number, bloom: number, reveal = 1) {
    ctx!.fillStyle = "#FBF6EF"; // almond
    ctx!.fillRect(0, 0, w, h);

    if (bloom > 0) {
      ctx!.globalAlpha = bloom;
      ctx!.drawImage(bg, 0, 0, w, h);
      ctx!.globalAlpha = 1;
    }

    const n = Math.max(150, Math.round(w / pitch));
    const half = w / 2 + 70;
    const cx = w / 2;
    const steps = 48;
    const rgb = lineRGB(bloom);
    const strength = tone === "light" ? 0.2 : 0.3;
    const mainA = strength + 0.06 * bloom;
    const bandA = 0.05 + 0.1 * bloom;

    // Soft leading edge, so lines arrive gradually rather than switching on.
    const EDGE = 0.22;
    const front = reveal * (1 + EDGE);

    ctx!.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const u = (i / (n - 1)) * 2 - 1;

      // 0 at the centre, 1 at the edges — the order lines fade in.
      const fade =
        reveal >= 1
          ? 1
          : Math.max(0, Math.min(1, (front - Math.abs(u)) / EDGE));
      if (fade <= 0) continue;

      ctx!.beginPath();
      for (let s = 0; s <= steps; s++) {
        const v = (s / steps) * 2 - 1;
        const k = m + (1 - m) * (v * v); // smooth waist, no kink at v = 0
        const x = cx + u * half * k;
        const y = (v * 0.5 + 0.5) * h;
        if (s) ctx!.lineTo(x, y);
        else ctx!.moveTo(x, y);
      }
      ctx!.strokeStyle =
        i % 7 === 0
          ? `rgba(91,46,68,${(bandA * fade).toFixed(3)})` // plum
          : `rgba(${rgb},${(mainA * fade).toFixed(3)})`;
      ctx!.stroke();
    }
  }

  return { size, paint };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
