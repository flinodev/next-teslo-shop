"use client";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import clsx from "clsx";
import { placeOrder } from "@/actions";
import { useRouter } from "next/navigation";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const router = useRouter();

  const { subtotal, tax, total, itemsInCart } = useCartStore((state) =>
    state.getSummary()
  );

  if (itemsInCart <= 0) {
    redirect("/empty");
  }

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const resp = await placeOrder(productsToOrder, address);

    if (!resp.ok) {
      setErrorMessage(resp.message);
      setIsPlacingOrder(false);
      return;
    }
    clearCart();
    router.replace("/orders/" + resp.order?.id);
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>

      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">{`${itemsInCart} artículo${
          itemsInCart ? "s" : ""
        }`}</span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subtotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="text-2xl mt-5">Total</span>
        <span className="text-2xl mt-5 text-right">
          {currencyFormat(total)}
        </span>
      </div>
      <div className="mb-5 mt-2 w-full">
        <p className="mb-5">
          <span className="text-xs">
            Al hacer click en Colocar orden aceptas nuestros{" "}
            <a href="#" className="underline">
              Términos y condiciones de uso
            </a>{" "}
            y nuestras{" "}
            <a href="#" className="underline">
              Políticas de privacidad
            </a>
          </span>
        </p>
        <p className="text-red-500 p-2">{errorMessage}</p>
        <button
          onClick={onPlaceOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
