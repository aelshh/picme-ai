"use client";

const navOffset = 100;

const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

export function smoothScrollTo(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  const target = el.getBoundingClientRect().top + window.scrollY - navOffset;
  const start = window.scrollY;
  const distance = target - start;
  const duration = 400;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    window.scrollTo(0, start + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
