# Nav / Pricing / Logo Fixes

## 1. Smooth Scroll — `hooks/use-smooth-scroll.ts`

Replace the entire file with:

```ts
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
```

Changes: `easeInOutQuad` → `easeOutCubic`, duration 600→400.

---

## 2. Pricing Cards — `components/landing-page/PricingSection.tsx`

Replace the entire file with the version that has:

1. `import { motion, AnimatePresence } from "framer-motion";` (add `AnimatePresence`)
2. Remove `staggerContainer/staggerItem` imports (they cause remount animation on toggle)
3. `key={product.id}` instead of `key={price.id}`
4. Wrap cards grid in `<AnimatePresence mode="popLayout">`
5. Replace early `if (!price) return null` with conditional rendering `{priceString ? ... : "Contact us"}`
6. Add `layout` prop to `motion.div` for smooth reflow
7. Use `initial/animate/exit` instead of `staggerItem` variants

---

## 3. Navbar Animations — `components/landing-page/Navigation.tsx`

Replace the file adding:

1. **Import additions:**
   ```ts
   import { useScroll, useTransform } from "framer-motion";
   ```

2. **Add inside component, before return:**
   ```ts
   const { scrollY } = useScroll();
   const shadowOpacity = useTransform(scrollY, [0, 100], [0.02, 0.12]);
   ```

3. **On the `<nav>` element, add:**
   - `style={{ boxShadow: useTransform(shadowOpacity, (v) => `0 4px 24px rgba(0,0,0,${v})`) }}`
   - `className` gets `animate-float` added

4. **On each nav link button, add:**
   - `whileHover={{ scale: 1.05 }}`
   - `transition={{ type: "spring", stiffness: 300, damping: 15 }}`

5. **On "Get Started" link, add glow CSS:**
   Add `animate-pulse-glow` — add keyframe in globals.css and class on the button

---

## 4. Logo — `components/Logo.tsx`

Replace with custom P monogram SVG:

```tsx
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex gap-2.5 items-center justify-center text-foreground group",
        className
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="24" height="24" rx="6" fill="url(#p-logo-gradient)" />
        <text
          x="12"
          y="16.5"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="700"
          fontFamily="system-ui"
        >
          P
        </text>
        <defs>
          <linearGradient id="p-logo-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-semibold tracking-tight">Picme AI</span>
      <span className="w-1 h-1 rounded-full bg-accent-indigo inline-block animate-pulse-soft mt-2" />
    </Link>
  );
};

export default Logo;
```

---

## 5. globals.css additions

Add to `@theme inline` keyframes:

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px hsl(var(--accent-indigo) / 0.15); }
  50% { box-shadow: 0 0 16px hsl(var(--accent-indigo) / 0.3); }
}
```

And animation:

```css
--animate-pulse-glow: pulse-glow 2s ease-in-out infinite;
```
