/**
 * Warped hairline field.
 *
 *   m      1 = straight, evenly spaced lines. As m falls toward 0 every line is
 *          pulled toward the vertical centre, producing the pinched bowtie.
 *          The waist uses v*v so the curve stays smooth through the middle.
 *   bloom  0 = brick lines on almond. 1 = tinted lines over the ground.
 *   reveal 0 = no lines drawn, 1 = all of them. Lines fade in from the centre
 *          outward, so the form materialises rather than cutting in.
 *   shift  0 = the warm ground. 1 = the cool ground. Driven by scroll.
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
   * Cool ground — plum tinted over almond. Plum at full strength is very dark
   * (white on plum is 10.9:1), so it is laid at partial alpha over the almond
   * page colour. That gives the pale lavender, and keeps ink type legible.
   */
  function paintCool() {
    prep(cool, coolx);
    const r = Math.max(w, h);

    coolx.fillStyle = "#FBF6EF"; // almond
    coolx.fillRect(0, 0, w, h);

    lay(coolx, [
      [0.04, 0.06, r * 0.72, "91,46,68", 0.72], // plum, top left
      [0.96, 0.1, r * 0.58, "91,46,68", 0.5], // plum, top right
      [0.1, 0.96, r * 0.5, "91,46,68", 0.34], // plum, bottom left
      [0.92, 0.9, r * 0.44, "91,46,68", 0.26], // plum, bottom right
      [0.55, 0.52, r * 0.46, "251,246,239", 0.92], // almond bloom through the centre
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

  /** brick -> almond as the ground blooms in, then -> plum as it cools. */
  function lineRGB(bloom: number, shift: number) {
    const r = mix(mix(BRICK[0], ALMOND[0], bloom), PLUM[0], shift * 0.8);
    const g = mix(mix(BRICK[1], ALMOND[1], bloom), PLUM[1], shift * 0.8);
    const b = mix(mix(BRICK[2], ALMOND[2], bloom), PLUM[2], shift * 0.8);
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

    // Soft leading edge, so lines arrive gradually rather than switching on.
    const EDGE = 0.22;
    const front = reveal * (1 + EDGE);

    ctx!.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const u = (i / (n - 1)) * 2 - 1;

      // 0 at the centre, 1 at the edges — the order lines fade in.
      const fade =
        reveal >= 1 ? 1 : Math.max(0, Math.min(1, (front - Math.abs(u)) / EDGE));
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
