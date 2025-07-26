import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
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
        "flex gap-2 items-center justify-center text-black",
        className
      )}
    >
      <Sparkles strokeWidth={1.5} className={className} />
      <span className={cn("font-semibold")}>Picme AI</span>
    </Link>
  );
};

export default Logo;
