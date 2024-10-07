"use client";
import { Product } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);
  const imageSrc = displayImage
    ? displayImage.startsWith("http")
      ? displayImage
      : "/products/" + displayImage
    : "/imgs/placeholder.jpg";
  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={imageSrc}
          alt={product.title}
          className="w-full object-cover"
          width={500}
          height={500}
          onMouseEnter={() => setDisplayImage(product.images[1])}
          onMouseLeave={() => setDisplayImage(product.images[0])}
        />
      </Link>
      <div className="p-4 flex flex-col">
        <Link href={`/product/${product.slug}`} className="hover:text-blue-600">
          {" "}
          {product.title}
        </Link>
        <span className="font-bold">${product.price}</span>
      </div>
    </div>
  );
};
