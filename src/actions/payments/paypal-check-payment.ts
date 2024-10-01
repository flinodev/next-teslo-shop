"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId: string) => {
  const authToken = await getPaypalBearerToken();
  console.log({ transactionId, authToken });
  if (!authToken) {
    return {
      ok: false,
      message: "No se pudo obtener el token de verificación",
    };
  }
  const resp = await verifyPaypalPayment(transactionId, authToken);
  if (!resp) {
    return {
      ok: false,
      message: "Error al verificar el pago",
    };
  }
  const { status, purchase_units } = resp;

  if (status !== "COMPLETED") {
    return {
      ok: false,
      message: "Pago pendiente en Paypal",
    };
  }

  try {
    console.log({ status, purchase_units });
    const orderId = purchase_units[0].invoice_id;
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });
    revalidatePath(`/orders/${orderId}`);
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "El pago no se pudo realizar",
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL || "";

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(oauth2Url, {
      ...requestOptions,
      cache: "no-store",
    }).then((resp) => resp.json());
    return result.access_token;
  } catch (error) {
    return null;
  }
};

const verifyPaypalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);
  const paypalOrderUrl = process.env.PAYPAL_ORDERS_URL;

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const response = await fetch(`${paypalOrderUrl}/${paypalTransactionId}`, {
      ...requestOptions,
      cache: "no-store",
    }).then((r) => r.json());
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
