"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  viewportConfig,
  defaultTransition,
} from "@/lib/animations";

const terminalSteps = [
  { text: "> Initializing Picme AI engine...", delay: 300 },
  { text: "> Loading your facial model...", delay: 600 },
  { text: "> Analyzing 14 uploaded photos...", delay: 400 },
  { text: "> Training custom portrait model...", delay: 800 },
  { text: "> Applying style: Professional Headshot Pack", delay: 500 },
  { text: "> Generating 12 high-res portraits...", delay: 700 },
  { text: "", delay: 200 },
  { text: "> ✨ Complete! 12/12 photos ready.", delay: 100 },
];

export default function LiveDemo() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (visibleLines >= terminalSteps.length) return;

    const step = terminalSteps[visibleLines];
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, step.delay);

    return () => clearTimeout(timer);
  }, [visibleLines]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((c) => !c);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section id="demo" className="w-full py-32 px-4 sm:px-6 lg:px-8 scroll-mt-nav">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={defaultTransition}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white border border-border shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-indigo" />
            <span className="text-xs font-medium text-muted-foreground">
              See It In Action
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            From upload to portrait in{" "}
            <span className="text-gradient-brand">minutes</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
            Watch our AI pipeline transform your photos into studio-grade
            portraits — fully automated.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ ...defaultTransition, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-lg shadow-black/[0.02]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs font-mono text-muted-foreground">
                picme-ai generate --model=new --pack=professional
              </span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed min-h-[280px] bg-white">
              {terminalSteps.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    line.text.includes("Complete")
                      ? "text-green-600 font-medium"
                      : line.text.startsWith(">")
                      ? "text-muted-foreground"
                      : ""
                  }
                >
                  {line.text || "\u00A0"}
                </motion.div>
              ))}
              {visibleLines < terminalSteps.length && (
                <span
                  className={`text-accent-indigo ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`}
                >
                  ▊
                </span>
              )}
              {visibleLines >= terminalSteps.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2"
                >
                  <span className="text-green-600 text-xs font-medium">Process complete</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
