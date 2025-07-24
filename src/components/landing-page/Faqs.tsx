import React from "react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqsList = [
  {
    question: "How does Pictoria AI work?",
    answer:
      "Pictoria AI uses advanced machine learning algorithms to analyze and understand your photos. It then generates new images based on your features and the scenarios you choose, creating realistic and personalized results.",
  },
  {
    question: "Is my data safe with Pictoria AI?",
    answer:
      "Yes, we take data privacy very seriously. All uploaded photos and generated images are encrypted and stored securely. We never share your personal data or images with third parties without your explicit consent.",
  },
  {
    question: "How many photos do I need to upload for best results?",
    answer:
      "For optimal results, we recommend uploading at least 10-20 diverse photos of yourself. This helps our AI model better understand your features and expressions, leading to more accurate and realistic generated images.",
  },
  {
    question: "Can I use Pictoria AI for commercial purposes?",
    answer:
      "Yes, our Pro and Enterprise plans include commercial usage rights for the images you generate. However, please note that you should always respect copyright and privacy laws when using AI-generated images.",
  },
  {
    question: "How often do you update the AI model?",
    answer:
      "We continuously work on improving our AI model. Major updates are typically released quarterly, with minor improvements and optimizations happening more frequently. All users benefit from these updates automatically.",
  },
  {
    question: "What are the differences between the free and paid plans?",
    answer:
      "The free plan allows you to generate up to 5 images per day. The Pro plan includes unlimited image generation, higher resolution output, and access to additional features. The Enterprise plan is tailored for businesses and offers custom integrations and dedicated support.",
  },
];

const Question = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger className="text-left">{question}</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
};

const Faqs = () => {
  return (
    <section
      id="faqs"
      className="w-full  py-32 px-6 xs:px-8 sm:px-0 sm:mx-8 lg:mx-auto flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="group relative mx-auto flex w-fit  items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] bg-background backdrop-blur-0 ">
        <span
          className={cn(
            "absolute inset-0 block h-full w-full animate-gradient  rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
          )}
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
            WebkitClipPath: "padding-box",
          }}
        />

        <AnimatedGradientText className="text-sm font-medium">
          FAQs
        </AnimatedGradientText>
      </div>
      <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mt-4">
        Frequently Asked Questions
      </h2>
      <p className="text-base text-muted-foreground lg:max-w-[75%] mt-4 text-center">
        Here are some of the most frequently asked questions about our product.
      </p>
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-4xl mx-auto mt-16"
      >
        {faqsList.map((faq) => {
          return <Question key={faq.question} {...faq} />;
        })}
      </Accordion>
    </section>
  );
};

export default Faqs;
