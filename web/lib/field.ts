/**
 * Warped hairline field.
 *
 *   m      1 = straight, evenly spaced lines. As m falls toward 0 every line is
 *          pulled toward the vertical centre. The waist uses v*v so the curve
 *          stays smooth through the middle.
 *   bloom  0 = bare page. 1 = the ground fully painted.
 *   reveal 0 = no lines drawn, 1 = all of them. Lines grow downward from the
 *          top edge on staggered offsets, so they fall into place.
 *   shift  the scroll journey. 0 = warm, 0.5 = light blue, 1 = dark blue.
 *
 * Three grounds, each painted once into an offscreen canvas and composited in
 * order, so an animating frame only redraws strokes plus a few drawImage calls.
 *
 * The warm ground is Section 05. The two blue grounds exist only for the hero
 * transition and are declared alongside the tokens in globals.css.
 */

const ALMOND = [251, 246, 239] as const;
const PLUM = [91, 46, 68] as const;
const NAVY = [10, 22, 38] as const;

export type Field = {
  size: () => void;
  paint: (m: number, bloom: number, reveal?: number, shift?: number) => void;
};

export type Tone = "deep" | "light";

type Bloom = [number, number, number, string, number];

export function makeField(
  cv: HTMLCanvasElement,
  pitch = 6,
  tone: Tone = "light",
): Field {
  const ctx = cv.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");

  const mk = () => {
    const c = document.createElement("canvas");
    return [c, c.getContext("2d")!] as const;
  };
  const [warmC, warmX] = mk();
  const [roseC, roseX] = mk();
  const [skyC, skyX] = mk();

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

  /** Warm ground — Section 05: error, clay, brick, amber. Where the hero opens. */
  function paintWarm() {
    prep(warmC, warmX);
    const r = Math.max(w, h);

    const g = warmX.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#A8321A"); // error
    g.addColorStop(0.45, "#D9714D"); // clay
    g.addColorStop(1, "#A8321A");
    warmX.fillStyle = g;
    warmX.fillRect(0, 0, w, h);

    lay(warmX, [
      [0.14, 0.58, r * 0.58, "217,113,77", 0.7], // clay, left lift
      [0.9, 0.46, r * 0.52, "168,50,26", 0.9], // error, deep right
      [0.34, 0.02, r * 0.54, "168,50,26", 0.8], // error, deep top
      [0.72, 0.94, r * 0.44, "179,58,30", 0.7], // brick, lower right
      [0.48, 0.6, r * 0.46, "232,163,61", 0.3], // amber lift behind the type
    ]);

    const v = warmX.createRadialGradient(
      w * 0.5, h * 0.55, r * 0.24,
      w * 0.5, h * 0.55, r * 0.85,
    );
    v.addColorStop(0, "rgba(42,27,20,0)");
    v.addColorStop(1, "rgba(42,27,20,.34)");
    warmX.fillStyle = v;
    warmX.fillRect(0, 0, w, h);
  }

  /** Light pink — the bridge out of the warm ground. */
  function paintRose() {
    prep(roseC, roseX);
    const r = Math.max(w, h);

    const g = roseX.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#E6B4BE"); // rose-300
    g.addColorStop(0.48, "#F2D7DC"); // rose-200
    g.addColorStop(1, "#E6B4BE");
    roseX.fillStyle = g;
    roseX.fillRect(0, 0, w, h);

    lay(roseX, [
      [0.16, 0.14, r * 0.62, "201,128,143", 0.6], // rose-500
      [0.9, 0.24, r * 0.54, "156,110,134", 0.46], // mauve-600
      [0.1, 0.9, r * 0.5, "217,113,77", 0.24], // clay, carried over from warm
      [0.88, 0.92, r * 0.46, "201,128,143", 0.36],
      [0.52, 0.54, r * 0.46, "255,255,255", 0.82], // lift behind the type
    ]);
  }

  /** Light blue shaded with dark blue — where the journey ends. */
  function paintSky() {
    prep(skyC, skyX);
    const r = Math.max(w, h);

    const g = skyX.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#C3D6EC"); // sky-300
    g.addColorStop(0.48, "#EAF1F8"); // sky-100
    g.addColorStop(1, "#C3D6EC");
    skyX.fillStyle = g;
    skyX.fillRect(0, 0, w, h);

    lay(skyX, [
      [0.1, 0.08, r * 0.6, "10,22,38", 0.5], // navy-900, deep corner
      [0.94, 0.14, r * 0.52, "27,53,86", 0.46], // navy-700
      [0.06, 0.95, r * 0.48, "27,53,86", 0.4],
      [0.92, 0.9, r * 0.46, "91,132,180", 0.5], // sky-600
      [0.5, 0.5, r * 0.5, "255,255,255", 0.92], // lift behind the type
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
    paintRose();
    paintSky();
  }

  const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

  /**
   * Almond hairlines over the warm ground, plum over the pink, navy over the
   * blue — so they stay readable at every stage.
   */
  function lineRGB(p1: number, p2: number) {
    const r = mix(mix(ALMOND[0], PLUM[0], p1), NAVY[0], p2);
    const g = mix(mix(ALMOND[1], PLUM[1], p1), NAVY[1], p2);
    const b = mix(mix(ALMOND[2], PLUM[2], p1), NAVY[2], p2);
    return `${r},${g},${b}`;
  }

  const smooth = (x: number) => {
    const t = Math.max(0, Math.min(x, 1));
    return t * t * (3 - 2 * t);
  };

  function paint(m: number, bloom: number, reveal = 1, shift = 0) {
    // Warm -> pink -> blue. The windows overlap so no stage snaps in.
    const p1 = smooth(shift / 0.45);
    const p2 = smooth((shift - 0.4) / 0.6);

    ctx!.fillStyle = "#FBF6EF"; // almond
    ctx!.fillRect(0, 0, w, h);

    if (bloom > 0) {
      ctx!.globalAlpha = bloom;
      ctx!.drawImage(warmC, 0, 0, w, h);
      if (p1 > 0) {
        ctx!.globalAlpha = bloom * p1;
        ctx!.drawImage(roseC, 0, 0, w, h);
      }
      if (p2 > 0) {
        ctx!.globalAlpha = bloom * p2;
        ctx!.drawImage(skyC, 0, 0, w, h);
      }
      ctx!.globalAlpha = 1;
    }

    const n = Math.max(150, Math.round(w / pitch));
    const half = w / 2 + 70;
    const cx = w / 2;
    const steps = 48;
    const rgb = lineRGB(p1, p2);
    const mainA = (tone === "light" ? 0.2 : 0.3) + 0.02 * p1 + 0.02 * p2;
    const bandA = mainA * 1.5;

    // Lines fall from the top edge, each on its own offset so they arrive
    // unevenly rather than as one descending block.
    const SPREAD = 0.45;

    ctx!.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const u = (i / (n - 1)) * 2 - 1;

      let grow = 1;
      if (reveal < 1) {
        const off = ((((i * 2654435761) >>> 0) % 1000) / 1000) * SPREAD;
        grow = Math.max(0, Math.min(1, reveal * (1 + SPREAD) - off));
        if (grow <= 0) continue;
      }

      const vEnd = -1 + 2 * grow;

      ctx!.beginPath();
      for (let s = 0; s <= steps; s++) {
        const v = -1 + (vEnd + 1) * (s / steps);
        const k = m + (1 - m) * (v * v);
        const x = cx + u * half * k;
        const y = (v * 0.5 + 0.5) * h;
        if (s) ctx!.lineTo(x, y);
        else ctx!.moveTo(x, y);
      }
      ctx!.strokeStyle = `rgba(${rgb},${(i % 7 === 0 ? bandA : mainA).toFixed(3)})`;
      ctx!.stroke();
    }
  }

  return { size, paint };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
