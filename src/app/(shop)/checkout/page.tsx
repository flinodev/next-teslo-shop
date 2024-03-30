import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";
import { QuantitySelector } from "../../../components/product/quantity-selector/QuantitySelector";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px] ">
        <Title title="Verificar orden" />
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex flex-col mt-5">
            <span className="text-xl">Verifica tu compra</span>
            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>

            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  alt={product.title}
                  className="rounded mr-5"
                />

                <div>
                  <p>{product.title}</p>
                  <p>${product.price} X 3</p>
                  <p className="font-bold">Subtotal ${product.price * 3}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>

            <div className="mb-10">
              <p className="text-xl">Francisco Lino</p>
              <p>Calle Oriente 35</p>
              <p>Colonia Guadalupana IV Sección</p>
              <p>Valle de Chalco Solidaridad</p>
              <p>Estado de México</p>
              <p>C.P. 123456</p>
              <p>55 89 12 11 00</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">3 artículos</span>

              <span>Subtotal</span>
              <span className="text-right">$300</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">$45</span>

              <span className="text-2xl mt-5">Total</span>
              <span className="text-2xl mt-5 text-right">$345</span>
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
              <Link
                className="flex btn-primary justify-center"
                href="/orders/12356"
              >
                Colocar orden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
