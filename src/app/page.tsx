import PricingSection from "@/components/landing-page/PricingSection";
import { getProducts, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const [user, products] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
  ]);

  console.log(products);
  return (
    <main className="flex flex-col min-h-screen min-w-screen justify-center items-center">
      <PricingSection products={products} />
    </main>
  );
}
