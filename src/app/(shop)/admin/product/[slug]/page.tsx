import React from "react";
import { Title } from "../../../../../components/ui/title/Title";
import { getCategories, getProductBySlug } from "@/actions";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;
  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product && slug !== "new") {
    //!TODO: new
    redirect("/admin/products");
  }
  const title = slug === "new" ? "Nuevo Producto" : "Editar producto";
  return (
    <>
      <Title title={title}></Title>
      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
}
