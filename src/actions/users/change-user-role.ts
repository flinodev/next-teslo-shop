"use server";

import { revalidate } from "@/app/(shop)/page";
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (id: string, role: string) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "Debe estar autenticado",
    };
  }

  try {
    if (role !== "admin" && role !== "user") {
      throw new Error(`${role} Invalid role`);
    }
    const userUpdated = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role: role,
      },
    });
    revalidatePath("/admin/users");
    return {
      ok: true,
      user: userUpdated,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrio un error",
    };
  }
};
