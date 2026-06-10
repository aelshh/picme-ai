import { type Variants } from "framer-motion";

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
};

export const fadeUpSlow: Variants = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
};

export const staggerContainer: Variants = {
  initial: {},
  whileInView: {},
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
};

export const defaultTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const springTransition = {
  type: "spring" as const,
  stiffness: 150,
  damping: 15,
};

export const viewportConfig = {
  once: true,
  margin: "-100px" as const,
};

export function withViewport(variants: Variants) {
  return {
    ...variants,
    viewport: viewportConfig,
    transition: defaultTransition,
  };
}
