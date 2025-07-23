"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import React, { useId } from "react";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { resetPassword } from "@/app/actions/server-actions";

const formSchema = z.object({
  email: z.string().email("Enter a Valid Email"),
});

const LoginForm = ({ className }: { className?: string }) => {
  const toastId = useId();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Sending password reset email...", { id: toastId });
    const { success, error } = await resetPassword({
      email: values.email || "",
    });

    try {
      if (!success) {
        toast.error(error, { id: toastId });
      } else {
        toast.success(
          "Password reset email sent! Please check your email for instructions.",
          { id: toastId }
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.message || "There is an error sending the password reset email!",
        {
          id: toastId,
        }
      );
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer">
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
