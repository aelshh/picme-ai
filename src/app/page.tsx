import LandingPage from "@/components/landing-page/LandingPage";
import { getProducts, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const [user, products] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
  ]);

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col">
      <LandingPage products={products ?? []} />
    </main>
  );
}
