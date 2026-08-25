/**
 * Warped hairline field.
 *
 *   m      1 = straight, evenly spaced lines. As m falls toward 0 every line is
 *          pulled toward the vertical centre. The waist uses v*v so the curve
 *          stays smooth through the middle.
 *   bloom  0 = bare page. 1 = the ground fully painted.
 *   reveal 0 = no lines drawn, 1 = all of them. Lines grow downward from the
 *          top edge on staggered offsets, so they fall into place.
 *   shift  0 = the light ground. 1 = the dark ground. Driven by scroll.
 *
 * Both grounds are painted once into offscreen canvases and composited, so an
 * animating frame only redraws strokes plus two drawImage calls.
 *
 * PALETTE NOTE: this blue scheme replaces the brief's Section 05 tokens at the
 * client's direction. Values are mirrored in globals.css as --sky-* / --navy-*.
 */

const INK_ON_LIGHT = [10, 22, 38] as const; // navy-900
const PAPER = [234, 241, 248] as const; // sky-100

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

  const lightC = document.createElement("canvas");
  const lightX = lightC.getContext("2d")!;
  const darkC = document.createElement("canvas");
  const darkX = darkC.getContext("2d")!;
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

  /** Light ground — pale blue with deeper blue blooms drifting through it. */
  function paintLight() {
    prep(lightC, lightX);
    const r = Math.max(w, h);

    const g = lightX.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#C3D6EC"); // sky-300
    g.addColorStop(0.48, "#EAF1F8"); // sky-100
    g.addColorStop(1, "#C3D6EC");
    lightX.fillStyle = g;
    lightX.fillRect(0, 0, w, h);

    lay(lightX, [
      [0.06, 0.1, r * 0.66, "91,132,180", 0.62], // sky-600, top left
      [0.95, 0.16, r * 0.56, "91,132,180", 0.44], // sky-600, top right
      [0.12, 0.94, r * 0.5, "27,53,86", 0.22], // navy-700, bottom left
      [0.9, 0.9, r * 0.46, "91,132,180", 0.34], // sky-600, bottom right
      [0.52, 0.52, r * 0.46, "255,255,255", 0.9], // bloom through the middle
    ]);
  }

  /** Dark ground — deep navy, holding the same bloom geometry. */
  function paintDark() {
    prep(darkC, darkX);
    const r = Math.max(w, h);

    const g = darkX.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0A1626"); // navy-900
    g.addColorStop(0.5, "#1B3556"); // navy-700
    g.addColorStop(1, "#0A1626");
    darkX.fillStyle = g;
    darkX.fillRect(0, 0, w, h);

    lay(darkX, [
      [0.18, 0.16, r * 0.66, "45,84,133", 0.8], // navy-600, upper left
      [0.88, 0.6, r * 0.56, "45,84,133", 0.62], // navy-600, lower right
      [0.5, 0.5, r * 0.42, "91,132,180", 0.34], // sky-600 lift behind the type
      [0.06, 0.95, r * 0.44, "5,11,20", 0.75], // deepest, corner
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
    paintLight();
    paintDark();
  }

  const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

  /** navy hairlines on the light ground, pale ones once it has gone dark. */
  function lineRGB(shift: number) {
    const r = mix(INK_ON_LIGHT[0], PAPER[0], shift);
    const g = mix(INK_ON_LIGHT[1], PAPER[1], shift);
    const b = mix(INK_ON_LIGHT[2], PAPER[2], shift);
    return `${r},${g},${b}`;
  }

  function paint(m: number, bloom: number, reveal = 1, shift = 0) {
    ctx!.fillStyle = "#EAF1F8"; // sky-100
    ctx!.fillRect(0, 0, w, h);

    if (bloom > 0) {
      ctx!.globalAlpha = bloom;
      ctx!.drawImage(lightC, 0, 0, w, h);
      if (shift > 0) {
        ctx!.globalAlpha = bloom * shift;
        ctx!.drawImage(darkC, 0, 0, w, h);
      }
      ctx!.globalAlpha = 1;
    }

    const n = Math.max(150, Math.round(w / pitch));
    const half = w / 2 + 70;
    const cx = w / 2;
    const steps = 48;
    const rgb = lineRGB(shift);
    const base = tone === "light" ? 0.14 : 0.16;
    const mainA = base + 0.06 * shift;
    const bandA = mainA * 1.7;

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
