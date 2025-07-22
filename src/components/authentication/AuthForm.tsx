"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { Button } from "../ui/button";
import SignupForm from "./SignupForm";
import Link from "next/link";
import ResetPassword from "./ResetPassword";

const AuthForm = ({ state }: { state: string | undefined }) => {
  const [mode, setMode] = useState(state || "login");
  return (
    <div className="flex flex-col space-y-4 text-center">
      {mode === "login" ? (
        <h1 className="font-semibold tracking-tight text-2xl">Login</h1>
      ) : mode === "signup" ? (
        <h1 className="font-bold text-xl">Sign Up</h1>
      ) : (
        <h1 className="font-bold text-xl">Reset Password</h1>
      )}
      {mode === "login" ? (
        <p className="text-sm text-muted-foreground  mb-9">
          Enter your email below to login your account
        </p>
      ) : mode === "signup" ? (
        <p className="text-sm text-muted-foreground  mb-9">
          Enter your information below to create an account
        </p>
      ) : (
        <p className="text-sm text-muted-foreground  mb-9">
          Enter your email below to reset your password
        </p>
      )}
      {mode === "login" ? (
        <>
          <LoginForm className="w-full text-left" />
          <div className="flex items-center justify-between">
            <Button
              variant={"link"}
              className="p-0 text-sm mt-3 cursor-pointer"
              onClick={() => setMode("signup")}
            >
              Need an account? Sign Up
            </Button>
            <Button
              variant={"link"}
              className="p-0 text-sm mt-3 cursor-pointer"
              onClick={() => setMode("resetPassword ")}
            >
              Forgot Password?{" "}
            </Button>
          </div>
        </>
      ) : mode === "signup" ? (
        <>
          <SignupForm className="text-left" />
          <Button
            variant={"link"}
            className="p-0 text-sm mt-3 cursor-pointer"
            onClick={() => setMode("login")}
          >
            Already have an account? Log In{" "}
          </Button>
          <p className="text-muted-foreground text-sm">
            By clicking signup, you agree our{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
          </p>
        </>
      ) : (
        <>
          <ResetPassword />
          <Button
            variant={"link"}
            className="p-0  text-sm font-normal mt-3 cursor-pointer"
            onClick={() => setMode("login")}
          >
            Back to Login{" "}
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthForm;
