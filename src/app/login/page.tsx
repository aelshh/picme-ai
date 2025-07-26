import Image from "next/image";
import React from "react";
import AuthImg from "@/public/login.jpg";
import Logo from "@/components/Logo";
import AuthForm from "@/components/authentication/AuthForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface SearchParmasType {
  state?: string;
}

const AuthPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParmasType>;
}) => {
  const state = (await searchParams).state;

  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex  flex-col lg:grid lg:grid-cols-2">
      {/* Left Side: Image & Quote */}
      <div className="relative  hidden sm:block h-64 min-h-[320px] lg:h-full w-full">
        <Image
          src={AuthImg}
          alt="login image"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* Top Gradient */}
        <div className="bg-gradient-to-b from-black/60 to-transparent absolute top-0 h-[30%] w-full z-10" />
        {/* Bottom Gradient */}
        <div className="bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 h-[50%] w-full z-10" />
        {/* Logo */}
        <div className="z-20 top-4 left-4 sm:top-7 sm:left-7 text-primary-foreground absolute">
          <Logo className="h-8 w-auto  text-white/80" />
        </div>
        {/* Quote */}
        <blockquote className="absolute bottom-4 left-4 sm:bottom-7 sm:left-7 z-20 text-primary-foreground max-w-[90%] ">
          <p className="text-base   leading-snug">
            &quot;Picme AI is a game changer for me. I have been able to
            generate high quality professional headshots within minutes. It has
            saved me countless hours of work and cost as well.&quot;
          </p>
          <footer className="text-xs sm:text-sm mt-2 font-semibold opacity-80">
            David S.
          </footer>
        </blockquote>
      </div>
      {/* Right Side: Auth Form */}
      <div className="flex flex-1 justify-center items-center py-8 px-4 sm:px-8 bg-background">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-primary">
            Welcome Back
          </h1>

          <AuthForm state={state} />
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
