"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  viewportConfig,
  defaultTransition,
} from "@/lib/animations";

const faqsList = [
  {
    question: "How does Picme AI work?",
    answer:
      "Upload 10–20 diverse photos of yourself. Our AI analyzes your features and trains a custom model. Then you can generate unlimited portraits in any style — from professional headshots to creative editorials.",
  },
  {
    question: "Is my data safe with Picme AI?",
    answer:
      "Absolutely. All uploaded photos and generated images are encrypted at rest and in transit. We never share your data or images with third parties without your explicit consent. You can delete your data at any time.",
  },
  {
    question: "How many photos do I need for best results?",
    answer:
      "We recommend uploading at least 10–20 photos with varied angles, expressions, and lighting. This helps our AI model learn your features comprehensively, resulting in more accurate and realistic generations.",
  },
  {
    question: "Can I use Picme AI for commercial purposes?",
    answer:
      "Yes. Our Pro and Enterprise plans include full commercial usage rights for all generated images. You can use them for social media, marketing, branding, and any other commercial application.",
  },
  {
    question: "How often is the AI model updated?",
    answer:
      "We continuously improve our models. Major updates roll out quarterly, with incremental improvements happening bi-weekly. All users automatically benefit from the latest advancements.",
  },
  {
    question: "What file formats and resolutions do you support?",
    answer:
      "We support JPEG and PNG uploads. Generated images are delivered in high-resolution PNG format at up to 2048x2048 pixels on the Pro plan, suitable for print and digital use.",
  },
];

function Question({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <AccordionItem
      value={question}
      className="border-b border-border last:border-0"
    >
      <AccordionTrigger className="text-left text-sm font-medium py-5 hover:no-underline group">
        <span className="group-hover:text-accent-indigo transition-colors">
          {question}
        </span>
      </AccordionTrigger>
      <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function Faqs() {
  return (
    <section
      id="faqs"
      className="w-full py-32 px-4 sm:px-6 lg:px-8 scroll-mt-nav"
    >
      <div className="max-w-3xl mx-auto">
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
              FAQ
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Got questions?{" "}
            <span className="text-gradient-brand">We&apos;ve got answers</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Everything you need to know about Picme AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ ...defaultTransition, delay: 0.1 }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-2xl border border-border bg-white px-6 shadow-sm"
          >
            {faqsList.map((faq) => (
              <Question key={faq.question} {...faq} />
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
