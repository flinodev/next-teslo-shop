"use server";
import { signOut } from "@/auth.config";
import { revalidatePath } from "next/cache";

export const logout = async () => {
  await signOut();
  revalidatePath("/");
};
