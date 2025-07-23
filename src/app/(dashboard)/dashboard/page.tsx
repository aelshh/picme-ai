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
    <section className=" container mx-auto flex-1 space-y-6">
      <div className="flex items-center justify-betwee">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.user_metadata.full_name}
        </h2>
      </div>
      <StatusCard
        imageCount={imageCount}
        modelCount={modelCount}
        credits={credits}
      />

      <div className="grid gap-6 grid-cols-4">
        <RecentImages
          images={(
            images?.filter(
              (img): img is typeof img & { url: string } =>
                typeof img.url === "string"
            ) ?? []
          ).slice(0, 6)}
        />

        <div className="h-full flex flex-col space-y-6">
          <QuickActions />
          <RecentModels models={models ?? []} />
        </div>
      </div>
    </section>
  );
}
