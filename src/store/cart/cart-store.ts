import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  getSummary: () => {
    subtotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      getSummary: () => {
        const { cart } = get();
        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        const subtotal = cart.reduce(
          (subtotal, item) => item.quantity * item.price + subtotal,
          0
        );
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        return {
          subtotal,
          tax,
          total,
          itemsInCart,
        };
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
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: quantity };
          }
          return { ...item };
        });
        set({ cart: updatedCartProducts });
      },
      removeProduct: (product: CartProduct) => {
        const { cart } = get();
        const updatedCartProducts: CartProduct[] = [];
        cart.forEach((item) => {
          if (item.id === product.id && item.size === product.size) return;
          updatedCartProducts.push(item);
        });
        set({ cart: updatedCartProducts });
      },
    }),
    { name: "shopping-cart" }
  )
);
