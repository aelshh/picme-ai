import Image from "next/image";
import React from "react";
import AuthImg from "@/public/login.jpg";
import Logo from "@/components/Logo";
import AuthForm from "@/components/authentication/AuthForm";

interface SearchParmasType {
  state?: string;
}

const AuthPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParmasType>;
}) => {
  const state = (await searchParams).state;
  return (
    <main className="grid grid-cols-2 h-screen ">
      <div className="relative h-full ">
        <Image
          src={AuthImg}
          alt="login image"
          className=" h-full w-full object-cover "
        />

        <div className="bg-gradient-to-b from-black/50 to-transparent absolute top-0 h-[30%] w-full z-10 "></div>
        <div className="bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 h-[50%] w-full z-10 "></div>
        <div className="z-20  top-7 left-7 text-primary-foreground absolute">
          <Logo />
        </div>
        <blockquote className="absolute bottom-7 left-7  z-20 text-primary-foreground">
          <p>
            &quot;Picme AI is a game changer for me. I have been able to
            generate high quality professional headshots within minutes. It has
            saved me countless hours of work and cost as well.&quot;
          </p>
          <footer className="text-sm mt-2">David S.</footer>
        </blockquote>
      </div>
      <div className=" flex justify-center items-center">
        <div className="w-[340px] mx-auto max-w-xl relative ">
          <AuthForm state={state} />
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
