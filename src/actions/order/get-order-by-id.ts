"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  try {
    const session = await auth();
    if (!session?.user.id) throw "Debe iniciar sesion";
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
    if (!order) throw `Orden con ${id} no existe`;
    if (session.user.role === "user") {
      if (session.user.id !== order.userId)
        throw `La orden ${id} no pertenece al usuario`;
    }
    return { ok: true, order };
  } catch (error) {
    console.log(error);
    return { ok: false, message: `No se encontró la orden con id ${id}` };
  }
};
