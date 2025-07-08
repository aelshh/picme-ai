import { Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex gap-2 items-center justify-center text-primary-foreground "
    >
      <Sparkles strokeWidth={1.5} />
      <span className="font-semibold">Picme AI</span>
    </Link>
  );
};

export default Logo;
