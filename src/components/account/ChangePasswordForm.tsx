/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import React, { useId, useState } from "react";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { changePassword } from "@/app/actions/server-actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[!@#$%^&*()-_=+{};:,<.>]).{8,}$/;

const formSchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .regex(passwordRegex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  confirmPassword: z
    .string({ required_error: "Password is required" })
    .regex(passwordRegex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

const ChangePasswordForm = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toastId = useId();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    toast.loading("Changing password...", { id: toastId });

    try {
      const { success, error } = await changePassword(values.password);
      if (!success) {
        setLoading(false);
        console.log("first toast");
        toast.error(error, { id: toastId });
      } else {
        setLoading(false);
        toast.success("Password is successfully updated!", {
          id: toastId,
        });

        router.push("/login");
      }
    } catch (error: any) {
      console.log("second toast");
      toast.error(String(error.message), { id: toastId });
    } finally {
      setLoading(false);
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  return (
    <div className={cn(className)}>
      <div className="flex flex-col mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Change Password
        </h1>
        <p className="text-sm -mt-2 text-muted-foreground">
          Enter your new password below to change/update your password.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter a strong password that meets the requirements above.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Re-enter your new password to confirm.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer "
          >
            {loading && <Loader2 className="animate-spin  text-gray-200" />}
            {loading ? "Changing password..." : "Change Password"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Make sure to remember your new password or store it securely.
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
