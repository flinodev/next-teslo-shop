"use server";

import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
  conditions?: any;
}

export const getPaginationProductsWithImages = async ({
  page = 1,
  take = 12,
  conditions = {},
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (isNaN(Number(take))) take = 1;
  try {
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: conditions,
    });
    const totalCount = await prisma.product.count({ where: conditions });
    const totalPages = Math.ceil(totalCount / take);
    console.log({ totalCount });
    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (err) {
    throw Error("No se pudo cargar los elementos");
  }
};
