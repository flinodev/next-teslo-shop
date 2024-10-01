"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getUsers = async () => {
  try {
    const session = await auth();
    if (session?.user.role !== "admin") {
      return {
        ok: false,
        message: "Debe ser administrador",
      };
    }
    const users = await prisma.user.findMany();

    return {
      ok: true,
      users,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pudieron consultar los usuarios",
    };
  }
};
