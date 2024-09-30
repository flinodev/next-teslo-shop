import React from "react";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log({ session });
  if (!session?.user) {
    redirect("/auth/login?redirectTo=/checkout/address");
  }
  return <>{children}</>;
}
