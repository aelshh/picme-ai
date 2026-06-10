"use client";

import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import SocialProof from "./SocialProof";
import Features from "./Features";
import LiveDemo from "./LiveDemo";
import PricingSection from "./PricingSection";
import Faqs from "./Faqs";
import CtaSection from "./CtaSection";
import Footer from "./Footer";
import type { Tables } from "@/datatypes.types";

type Product = Tables<"products">;
type Prices = Tables<"prices">;

interface ProductWithPrices extends Product {
  prices: Prices[];
}

interface LandingPageProps {
  products: ProductWithPrices[];
}

export default function LandingPage({ products }: LandingPageProps) {
  return (
    <>
      <Navigation />
      <HeroSection />
      <SocialProof />
      <Features />
      <LiveDemo />
      <PricingSection products={products} />
      <Faqs />
      <CtaSection />
      <Footer />
    </>
  );
}
