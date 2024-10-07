"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import Image from "next/image";
import { currencyFormat } from "@/utils";

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!loaded) {
    return <p>Cargando...</p>;
  }
  return (
    <>
      {productsInCart.map((product) => {
        const source = product.image.startsWith("http")
          ? product.image
          : "/products/" + product.image;
        return (
          <div key={`${product.slug}_${product.size}`} className="flex mb-5">
            <Image
              src={source}
              width={100}
              height={100}
              alt={product.title}
              className="rounded mr-5"
            />

            <div>
              <p>
                <span className="font-bold">{product.size}</span> -{" "}
                {product.title} ({product.quantity})
              </p>
              <p className="font-bold">
                {" "}
                {currencyFormat(product.price * product.quantity)}{" "}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};
