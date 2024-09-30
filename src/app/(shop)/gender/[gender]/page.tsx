export const revalidate = 60;
import React from "react";
import { getPaginationProductsWithImages } from "@/actions";
import { ProductGrid, Title, Pagination } from "@/components";
import { Category } from "@/interfaces";
import { Gender } from "@prisma/client";

interface Props {
  params: {
    gender: Gender;
  };
  searchParams: {
    page?: string;
  };
}

export default async function GenderPage({ searchParams, params }: Props) {
  const { gender } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const labels: Record<Category, string> = {
    kid: "Niños",
    men: "Hombres",
    unisex: "Todos",
    women: "Mujeres",
  };

  const { products, currentPage, totalPages } =
    await getPaginationProductsWithImages({
      page,
      conditions: { gender: gender },
    });

  return (
    <>
      <Title
        title={`${labels[gender]}`}
        subtitle={`Productos para ${labels[gender]}`}
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
