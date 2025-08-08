"use client";

import React from "react";

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
