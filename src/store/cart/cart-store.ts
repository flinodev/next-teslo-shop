import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  addProductToCart: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();
        // Revisar si el producto existe con la talla seleccionada
        const productInCart = cart.some(
          (cartItem) =>
            cartItem.id === product.id && cartItem.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // EL producto existe por talla, actualizamos la existencia
        const updatedCartProducts = cart.map((cartItem) => {
          if (cartItem.id === product.id && cartItem.size === product.size) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + product.quantity,
            };
          }
          return cartItem;
        });

        set({ cart: updatedCartProducts });
      },
    }),
    { name: "shopping-cart" }
  )
);
