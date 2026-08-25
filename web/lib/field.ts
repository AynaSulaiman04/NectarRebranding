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
  const [skyC, skyX] = mk();
  const [navyC, navyX] = mk();

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

  /** Light blue — the midpoint of the journey. */
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
      [0.06, 0.1, r * 0.66, "91,132,180", 0.62], // sky-600
      [0.95, 0.16, r * 0.56, "91,132,180", 0.44],
      [0.12, 0.94, r * 0.5, "27,53,86", 0.22], // navy-700
      [0.9, 0.9, r * 0.46, "91,132,180", 0.34],
      [0.52, 0.52, r * 0.46, "255,255,255", 0.9], // lift behind the type
    ]);
  }

  /** Dark blue — where the journey ends. */
  function paintNavy() {
    prep(navyC, navyX);
    const r = Math.max(w, h);

    const g = navyX.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0A1626"); // navy-900
    g.addColorStop(0.5, "#1B3556"); // navy-700
    g.addColorStop(1, "#0A1626");
    navyX.fillStyle = g;
    navyX.fillRect(0, 0, w, h);

    lay(navyX, [
      [0.18, 0.16, r * 0.66, "45,84,133", 0.8],
      [0.88, 0.6, r * 0.56, "45,84,133", 0.62],
      [0.5, 0.5, r * 0.42, "91,132,180", 0.34], // lift behind the type
      [0.06, 0.95, r * 0.44, "5,11,20", 0.75],
      [0.96, 0.04, r * 0.42, "5,11,20", 0.65],
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
    paintSky();
    paintNavy();
  }

  const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

  /**
   * Almond hairlines over the warm ground, navy over the pale blue, back to
   * almond over the dark blue — so they read against all three.
   */
  function lineRGB(p1: number, p2: number) {
    const r = mix(mix(ALMOND[0], NAVY[0], p1), ALMOND[0], p2);
    const g = mix(mix(ALMOND[1], NAVY[1], p1), ALMOND[1], p2);
    const b = mix(mix(ALMOND[2], NAVY[2], p1), ALMOND[2], p2);
    return `${r},${g},${b}`;
  }

  function paint(m: number, bloom: number, reveal = 1, shift = 0) {
    // first half of the scroll warms into blue, second half takes it dark
    const p1 = Math.max(0, Math.min(shift / 0.5, 1));
    const p2 = Math.max(0, Math.min((shift - 0.5) / 0.5, 1));

    ctx!.fillStyle = "#FBF6EF"; // almond
    ctx!.fillRect(0, 0, w, h);

    if (bloom > 0) {
      ctx!.globalAlpha = bloom;
      ctx!.drawImage(warmC, 0, 0, w, h);
      if (p1 > 0) {
        ctx!.globalAlpha = bloom * p1;
        ctx!.drawImage(skyC, 0, 0, w, h);
      }
      if (p2 > 0) {
        ctx!.globalAlpha = bloom * p2;
        ctx!.drawImage(navyC, 0, 0, w, h);
      }
      ctx!.globalAlpha = 1;
    }

    const n = Math.max(150, Math.round(w / pitch));
    const half = w / 2 + 70;
    const cx = w / 2;
    const steps = 48;
    const rgb = lineRGB(p1, p2);
    const mainA = (tone === "light" ? 0.2 : 0.3) - 0.06 * p1 + 0.06 * p2;
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
