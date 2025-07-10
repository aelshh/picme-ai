"use client";

import React from "react";

import { signOut } from "@/app/actions/server-actions";

const LogoutBtn = () => {
  async function handleSignOut() {
    await signOut();
  }
  return (
    <div className="text-red-500 h-full  p-0 m-0" onClick={handleSignOut}>
      Log Out
    </div>
  );
};

export default LogoutBtn;
