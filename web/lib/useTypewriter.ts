"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "./field";

/**
 * Types `text` out one character at a time once `start` is true.
 * Reduced motion gets the finished string immediately.
 */
export function useTypewriter(text: string, start: boolean, speed = 26, delay = 0) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setN(text.length);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    let i = 0;
    const tick = () => {
      i += 1;
      setN(i);
      if (i < text.length) timer = setTimeout(tick, speed);
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [text, start, speed, delay]);

  return { typed: text.slice(0, n), n, done: n >= text.length };
}

/** Milliseconds to wait before hero animation begins, so it follows the launch. */
export const LAUNCH_DONE_EVENT = "nectar:launch-done";

export function useLaunchGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The launch runs on every page load, so the hero always waits for it.
    if (prefersReducedMotion()) {
      setReady(true);
      return;
    }

    const onDone = () => setReady(true);
    window.addEventListener(LAUNCH_DONE_EVENT, onDone);
    // Safety net in case the event never fires.
    const fallback = setTimeout(() => setReady(true), 4200);
    return () => {
      window.removeEventListener(LAUNCH_DONE_EVENT, onDone);
      clearTimeout(fallback);
    };
  }, []);

  return ready;
}
