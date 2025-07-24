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
      className="flex gap-2  items-center justify-center text-black
       "
    >
      <Sparkles strokeWidth={1.5} className={className} />
      <span className="font-semibold text-white/80">Picme AI</span>
    </Link>
  );
};

export default Logo;
