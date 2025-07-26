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
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { logIn } from "@/app/actions/server-actions";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Enter a Valid Email"),
  password: z
    .string()
    .min(8, { message: "Password must be of atleast 8 charectors long" }),
});

const LoginForm = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const toastId = useId();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    toast.loading("Loging you In!", { id: toastId });

    const formData = new FormData();
    formData.append("password", values.password);
    formData.append("email", values.email);
    const { success, error } = await logIn(formData);
    if (!success) {
      setLoading(false);
      toast.error(error, { id: toastId });
    } else {
      setLoading(false);
      toast.success("You have successfully logged In!", {
        id: toastId,
      });
      redirect("/dashboard");
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer"
          >
            Login
            {loading && <Loader2 className="animate-spin  text-gray-200" />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
