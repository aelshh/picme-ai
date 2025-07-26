"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface AuthResponse {
  error: null | string;
  success: boolean;
  data: unknown | null;
}

export async function signUP(formData: FormData): Promise<AuthResponse> {
  const supabse = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("fullName"),
      },
    },
  };
  const { data: signupData, error } = await supabse.auth.signUp(data);

  return {
    error: error?.message || "There was an error signing up!",
    success: !error,
    data: signupData || null,
  };
}

export async function logIn(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { data: signupData, error } = await supabase.auth.signInWithPassword(
    data
  );

  return {
    error: error?.message || "There was an error loging In!",
    success: !error,
    data: signupData || null,
  };
}

export async function updateProfile(values: {fullName: string}): Promise<AuthResponse> {
  const supabase = await createClient();
  const full_name = values.fullName
  const { data: profileData, error } = await supabase.auth.updateUser({
    data: {full_name}
  }
  );

  return {
    error: error?.message || "There was an error updating the profile!",
    success: !error,
    data: profileData || null,
  };
}

export async function resetPassword(values: {email: string}): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data: resetPasswordData, error } = await supabase.auth.resetPasswordForEmail(values.email
  );

  return {
    error: error?.message || "There was an error sending the reset password email!",
    success: !error,
    data: resetPasswordData || null,
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}


export async function changePassword(newPassword: string): Promise<AuthResponse> {
  const supabse = await createClient();

  const { data, error } = await supabse.auth.updateUser({password: newPassword});

  if(data){
    await supabse.auth.signOut()
  }

  

  return {
    error: error?.message || "There was an error changin the password!",
    success: !error,
    data: data || null,
  };
}