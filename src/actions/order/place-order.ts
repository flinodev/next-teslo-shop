"use server";

import type { Address, Size } from "@/interfaces";
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  products: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      ok: false,
      message: "La sesión del usuario no existe",
    };
  }

  // Buscar los productos
  const productsDB = await prisma.product.findMany({
    where: {
      id: {
        in: products.map((p) => p.productId),
      },
    },
  });

  console.log({ productsDB });

  const itemsInOrder = products.reduce((count, p) => count + p.quantity, 0);
  console.log({ itemsInOrder });

  const { subtotal, tax, total } = products.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = productsDB.find(
        (product) => product.id === item.productId
      );
      if (!product) throw new Error(`${item.productId} no existe - 500`);
      const subtotal = product.price * productQuantity;

      totals.subtotal += subtotal;
      totals.tax += subtotal * 0.15;
      totals.total += subtotal * 1.15;

      return totals;
    },
    { subtotal: 0, tax: 0, total: 0 }
  );

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = productsDB.map((product) => {
        const productQuantity = products
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);
        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene inventario suficiente`);
        }
      });

      // 2. Crear la orden
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subtotal: subtotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: products.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
                size: p.size,
                price:
                  productsDB.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      // 3. Crear la dirección
      const { country, ...restAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        updatedProducts,
        order: order,
        orderAddress,
      };
    });
    console.log(prismaTx);
    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }
};
