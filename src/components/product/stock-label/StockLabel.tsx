"use client";
import React from "react";
import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getStock();
  }, []);

  const getStock = async () => {
    setIsLoading(true);
    const inStock = await getStockBySlug(slug);
    setIsLoading(false);
    setStock(inStock);
  };

  return (
    <>
      {isLoading ? (
        <h1
          className={`${titleFont.className} antialiased font-bold text-sm bg-gray-200 animate-pulse`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1 className={`${titleFont.className} antialiased font-bold text-sm`}>
          Stock: {stock > 0 ? stock : "No disponible"}
        </h1>
      )}
    </>
  );
};
