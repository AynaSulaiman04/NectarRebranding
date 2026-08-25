/**
 * Warped hairline field.
 *
 *   m      1 = straight, evenly spaced lines. As m falls toward 0 every line is
 *          pulled toward the vertical centre, producing the pinched bowtie.
 *          The waist uses v*v so the curve stays smooth through the middle.
 *   bloom  0 = brick lines on almond. 1 = tinted lines over the ground.
 *   reveal 0 = no lines drawn, 1 = all of them. Lines grow downward from the
 *          top edge on a staggered offset, so they fall into place.
 *   shift  0 = the warm ground. 1 = the dark ground. Driven by scroll.
 *
 * Both grounds are painted once into offscreen canvases and composited, so an
 * animating frame only redraws strokes plus two drawImage calls.
 *
 * Every colour here is a Section 05 token, or a token at partial alpha.
 * Do not introduce another.
 */

const BRICK = [179, 58, 30] as const;
const ALMOND = [251, 246, 239] as const;
const PLUM = [91, 46, 68] as const;

export type Field = {
  size: () => void;
  paint: (m: number, bloom: number, reveal?: number, shift?: number) => void;
};

/**
 * "deep" is the launch ground — brick and error dominant.
 * "light" is the hero ground, which also carries the cool second ground.
 */
export type Tone = "deep" | "light";

type Bloom = [number, number, number, string, number];

export function makeField(
  cv: HTMLCanvasElement,
  pitch = 6,
  tone: Tone = "deep",
): Field {
  const ctx = cv.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");

  const warm = document.createElement("canvas");
  const warmx = warm.getContext("2d")!;
  const cool = document.createElement("canvas");
  const coolx = cool.getContext("2d")!;
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

  let w = 1;
  let h = 1;

  function prep(c: HTMLCanvasElement, x: CanvasRenderingContext2D) {
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function lay(x: CanvasRenderingContext2D, blooms: Bloom[]) {
    for (const [bx, by, rad, rgb, a] of blooms) {
      const g = x.createRadialGradient(w * bx, h * by, 0, w * bx, h * by, rad);
      g.addColorStop(0, `rgba(${rgb},${a})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      x.fillStyle = g;
      x.fillRect(0, 0, w, h);
    }
  }

  /** Warm ground — brick, error, clay, amber. */
  function paintWarm() {
    prep(warm, warmx);
    const r = Math.max(w, h);

    const g = warmx.createLinearGradient(0, 0, w, h);
    if (tone === "light") {
      g.addColorStop(0, "#A8321A"); // error
      g.addColorStop(0.45, "#D9714D"); // clay
      g.addColorStop(1, "#A8321A"); // error
    } else {
      g.addColorStop(0, "#A8321A");
      g.addColorStop(0.52, "#D9714D");
      g.addColorStop(1, "#B33A1E");
    }
    warmx.fillStyle = g;
    warmx.fillRect(0, 0, w, h);

    lay(
      warmx,
      tone === "light"
        ? [
            [0.14, 0.58, r * 0.58, "217,113,77", 0.7], // clay, left lift
            [0.9, 0.46, r * 0.52, "168,50,26", 0.9], // error, deep right
            [0.34, 0.02, r * 0.54, "168,50,26", 0.8], // error, deep top
            [0.72, 0.94, r * 0.44, "179,58,30", 0.7], // brick, lower right
            [0.48, 0.6, r * 0.46, "232,163,61", 0.3], // amber lift behind the type
          ]
        : [
            [0.2, 0.8, r * 0.78, "232,163,61", 0.78],
            [0.86, 0.3, r * 0.62, "179,58,30", 0.9],
            [0.55, 0.04, r * 0.5, "168,50,26", 0.55],
          ],
    );

    if (tone === "light") {
      // Corner falloff, so the ground has depth rather than reading flat.
      const v = warmx.createRadialGradient(
        w * 0.5, h * 0.55, r * 0.24,
        w * 0.5, h * 0.55, r * 0.85,
      );
      v.addColorStop(0, "rgba(42,27,20,0)");
      v.addColorStop(1, "rgba(42,27,20,.34)");
      warmx.fillStyle = v;
      warmx.fillRect(0, 0, w, h);
    }
  }

  /**
   * Dark ground. Section 05 has no blue, so this is built from plum over ink —
   * the palette's only cool, dark direction. See the note in the handover.
   */
  function paintCool() {
    prep(cool, coolx);
    const r = Math.max(w, h);

    const g = coolx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#2A1B14"); // ink
    g.addColorStop(0.5, "#5B2E44"); // plum
    g.addColorStop(1, "#2A1B14"); // ink
    coolx.fillStyle = g;
    coolx.fillRect(0, 0, w, h);

    lay(coolx, [
      [0.2, 0.18, r * 0.66, "91,46,68", 0.85], // plum, upper left
      [0.86, 0.62, r * 0.56, "91,46,68", 0.7], // plum, lower right
      [0.5, 0.5, r * 0.42, "91,46,68", 0.5], // plum lift through the middle
      [0.08, 0.94, r * 0.42, "42,27,20", 0.7], // ink, deep corner
      [0.95, 0.04, r * 0.4, "42,27,20", 0.6], // ink, deep corner
    ]);
  }

  function size() {
    const rect = cv.getBoundingClientRect();
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintWarm();
    if (tone === "light") paintCool();
  }

  const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

  /** brick -> almond as the ground blooms in, staying almond over the dark. */
  function lineRGB(bloom: number, shift: number) {
    const r = mix(mix(BRICK[0], ALMOND[0], bloom), ALMOND[0], shift);
    const g = mix(mix(BRICK[1], ALMOND[1], bloom), ALMOND[1], shift);
    const b = mix(mix(BRICK[2], ALMOND[2], bloom), ALMOND[2], shift);
    return `${r},${g},${b}`;
  }

  function paint(m: number, bloom: number, reveal = 1, shift = 0) {
    ctx!.fillStyle = "#FBF6EF"; // almond
    ctx!.fillRect(0, 0, w, h);

    if (bloom > 0) {
      ctx!.globalAlpha = bloom;
      ctx!.drawImage(warm, 0, 0, w, h);
      if (shift > 0 && tone === "light") {
        ctx!.globalAlpha = bloom * shift;
        ctx!.drawImage(cool, 0, 0, w, h);
      }
      ctx!.globalAlpha = 1;
    }

    const n = Math.max(150, Math.round(w / pitch));
    const half = w / 2 + 70;
    const cx = w / 2;
    const steps = 48;
    const rgb = lineRGB(bloom, shift);
    const strength = tone === "light" ? 0.2 : 0.3;
    const mainA = strength + 0.06 * bloom + 0.1 * shift;
    const bandA = 0.05 + 0.1 * bloom;

    // Lines fall from the top edge, each on its own offset so they arrive
    // unevenly rather than as one descending block.
    const SPREAD = 0.45;

    ctx!.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const u = (i / (n - 1)) * 2 - 1;

      let grow = 1;
      if (reveal < 1) {
        // deterministic per-line offset in [0, SPREAD)
        const off = (((i * 2654435761) >>> 0) % 1000) / 1000 * SPREAD;
        grow = Math.max(0, Math.min(1, reveal * (1 + SPREAD) - off));
        if (grow <= 0) continue;
      }

      const fade = 1;
      const vEnd = -1 + 2 * grow;

      ctx!.beginPath();
      for (let s = 0; s <= steps; s++) {
        const v = -1 + (vEnd + 1) * (s / steps);
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
