"use server";
import { signIn } from "@/auth.config";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
    return "Success";
  } catch (error) {
    console.log(error);
    // if ((error as Error).message.includes("CredentialsSignin")) {
    //   return "CredentialsSignin";
    // }
    // throw error;
    return "CredentialsSignin";
  }
}
