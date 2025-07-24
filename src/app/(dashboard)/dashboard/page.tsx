import { getCredits } from "@/app/actions/credit-actions";
import { getImages } from "@/app/actions/image-actions";
import { fetchModels } from "@/app/actions/model-actions";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentImages from "@/components/dashboard/RecentImages";
import RecentModels from "@/components/dashboard/RecentModels";
import StatusCard from "@/components/dashboard/StatsCard";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: models, count: modelCount } = await fetchModels();
  const { data: credits } = await getCredits();
  const { data: images } = await getImages();

  const imageCount = images?.length || 0;

  return (
    <section className="container mx-auto  flex-1 space-y-6 px-2 xs:px-3 sm:px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-4xl   font-bold tracking-tight">
          Welcome back, {user?.user_metadata.full_name}
        </h2>
      </div>
      <StatusCard
        imageCount={imageCount}
        modelCount={modelCount}
        credits={credits}
      />

      <div className="grid gap-5 grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
        <div className="md:col-span-2 xl:col-span-3">
          <RecentImages
            images={(
              images?.filter(
                (img): img is typeof img & { url: string } =>
                  typeof img.url === "string"
              ) ?? []
            ).slice(0, 6)}
          />
        </div>
        <div className="h-full flex flex-col gap-5 xl:gap-0 xl:space-y-5 col-span-full md:col-span-1 xl:col-span-1">
          <QuickActions />
          <RecentModels models={models ?? []} />
        </div>
      </div>
    </section>
  );
}
