"use client";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { setTransactionId } from "@/actions";
import { paypalCheckPayment } from "@/actions/payments/paypal-check-payment";

interface Props {
  amount: number;
  orderId: string;
}

export const PaypalButton = ({ amount, orderId }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const roundedAmount = Math.round(amount * 100) / 100;

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${roundedAmount}`,
            currency_code: "USD",
          },
        },
      ],
    });
    const { ok, message, order } = await setTransactionId(
      orderId,
      transactionId
    );
    if (!ok) {
      throw new Error(message);
    }
    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();
    if (!details) return;

    await paypalCheckPayment(details.id!);
  };

  if (isPending) {
    return (
      <div className="animate-pulse mb-16">
        <div className="h-11 bg-gray-300 rounded"></div>
        <div className="h-11 bg-gray-300 rounded mt-2"></div>
      </div>
    );
  }

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
