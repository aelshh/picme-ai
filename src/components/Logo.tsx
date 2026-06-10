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
