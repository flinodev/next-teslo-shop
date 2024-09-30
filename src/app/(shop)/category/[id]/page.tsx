import React from "react";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: Category;
  };
}

export default function CategoryPage({ params }: Props) {
  const { id } = params;
  const categories = ["kid", "men", "women", "unisex"];

  const labels: Record<Category, string> = {
    kid: "Niños",
    men: "Hombres",
    unisex: "Todos",
    women: "Mujeres",
  };

  if (!categories.includes(id)) {
    notFound();
  }

  const products = initialData.products.filter((p) => p.gender === id);

  return (
    <>
      {/* <Title
        title={`${labels[id]}`}
        subtitle={`Productos para ${labels[id]}`}
        className="mb-2"
      />
      <ProductGrid products={products} /> */}
    </>
  );
}
