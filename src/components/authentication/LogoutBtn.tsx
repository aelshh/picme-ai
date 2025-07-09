"use client";

import React from "react";
import { Button } from "../ui/button";
import { signOut } from "@/app/actions/server-actions";

const LogoutBtn = () => {
  async function handleSignOut() {
    await signOut();
  }
  return (
    <Button variant="destructive" onClick={handleSignOut}>
      Logout
    </Button>
  );
};

export default LogoutBtn;
