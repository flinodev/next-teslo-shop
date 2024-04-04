import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";
import { QuantitySelector } from "../../../components/product/quantity-selector/QuantitySelector";
//import { redirect } from "next/navigation";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

export default function CartPage() {
  //redirect("/empty");
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px] ">
        <Title title="Carrito" />
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex flex-col mt-5">
            <span className="text-xl"> Agregar más items</span>
            <Link href="/" className="underline mb-5">
              Continua comprando
            </Link>

            <ProductsInCart />
          </div>

          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
