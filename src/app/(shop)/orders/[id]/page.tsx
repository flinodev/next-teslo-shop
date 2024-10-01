import { getOrderById } from "@/actions";
import { PaypalButton, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";
import { OrderStatus } from "../../../../components/orders/OrderStatus";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: Props) {
  const { id } = params;

  const resp = await getOrderById(id);
  if (!resp.ok || !resp.order) {
    redirect("/");
  }
  const order = resp.order;
  const productsInOrder = order.OrderItem;
  const addressToOrder = order.OrderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px] ">
        <Title title={`Orden #${id.split("-").pop()}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order.isPaid} />

            {productsInOrder.map((product) => (
              <div
                key={product.size + product.product.slug}
                className="flex mb-5"
              >
                <Image
                  src={`/products/${product.product.ProductImage.at(0)?.url}`}
                  width={100}
                  height={100}
                  alt={product.product.title}
                  className="rounded mr-5"
                />

                <div>
                  <p>
                    {product.product.title} ({product.size})
                  </p>
                  <p>
                    ${product.price} X {product.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal {currencyFormat(product.price * product.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>

            <div className="mb-10">
              <p className="text-xl">
                {addressToOrder?.firstName} {addressToOrder?.lastName}
              </p>
              <p>{addressToOrder?.address}</p>
              <p>{addressToOrder?.address2}</p>
              <p>{addressToOrder?.countryId}</p>
              <p>{addressToOrder?.city}</p>
              <p>{addressToOrder?.postalCode}</p>
              <p>{addressToOrder?.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order.itemsInOrder} artículo{order.itemsInOrder > 1 ? "s" : ""}
              </span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order.subtotal)}
              </span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order.tax)}</span>

              <span className="text-2xl mt-5">Total</span>
              <span className="text-2xl mt-5 text-right">
                {currencyFormat(order.total)}
              </span>
            </div>
            <div className="mb-5 mt-2 w-full">
              {order.isPaid ? (
                <OrderStatus isPaid={order.isPaid} />
              ) : (
                <PaypalButton orderId={order.id} amount={order.total} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
