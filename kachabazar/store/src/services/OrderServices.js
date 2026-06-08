"use server";

import { getHeaders } from "@lib/auth-server";
import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";
import { revalidatePath, revalidateTag } from "next/cache";

const addOrder = async (orderInfo) => {
  try {
    const response = await resilientFetch(`${baseURL}/order/add`, {
      cache: "no-cache",
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(orderInfo),
    });

    const orderResponse = await handleResponse(response);

    revalidateTag("user-orders");
    revalidateTag("reviewed_products");

    return {
      orderResponse,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

const addGuestOrder = async (orderInfo) => {
  try {
    const response = await resilientFetch(`${baseURL}/order/add/guest`, {
      cache: "no-cache",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderInfo),
    });

    const orderResponse = await handleResponse(response);

    return {
      orderResponse,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};
const createPaymentIntent = async (orderInfo) => {
  try {
    const response = await resilientFetch(
      `${baseURL}/order/create-payment-intent`,
      {
        cache: "no-cache",
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(orderInfo),
      },
    );

    const stripeInfo = await handleResponse(response);

    return {
      stripeInfo,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

const addRazorpayOrder = async ({ orderInfo }) => {
  try {
    const response = await resilientFetch(`${baseURL}/order/add/razorpay`, {
      cache: "no-cache",
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ orderInfo }),
    });

    const order = await handleResponse(response);
    revalidateTag("user-orders");
    revalidateTag("reviewed_products");

    return {
      order,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

const createOrderByRazorPay = async ({ amount }) => {
  try {
    const response = await resilientFetch(`${baseURL}/order/create/razorpay`, {
      cache: "no-cache",
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ amount }),
    });
    const order = await handleResponse(response);
    // console.log("order", order);

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    // console.log("error", error);
    return {
      error: error.message,
    };
  }
};

const getOrderCustomer = async ({ page = 1, limit = 8 }) => {
  try {
    const response = await resilientFetch(
      `${baseURL}/order?limit=${limit}&page=${page}`,
      {
        // cache: "force-cache",

        next: {
          revalidate: 900,
          tags: ["user-orders"],
        },
        headers: await getHeaders(),
      },
    );

    const orders = await handleResponse(response);
    // console.log("orders::", orders);

    return {
      data: orders,
    };
  } catch (error) {
    // console.log("error", error);
    return {
      error: error.message,
    };
  }
};

const getOrderById = async ({ id }) => {
  try {
    const response = await resilientFetch(`${baseURL}/order/${id}`, {
      cache: "force-cache",
      headers: await getHeaders(),
    });

    const order = await handleResponse(response);
    // console.log("order::", order);

    return {
      data: order,
    };
  } catch (error) {
    // console.log("error", error);
    return {
      error: error.message,
    };
  }
};
//for sending email invoice to customer
const sendEmailInvoiceToCustomer = async (body) => {
  try {
    const response = await resilientFetch(`${baseURL}/order/customer/invoice`, {
      cache: "no-cache",
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(body),
    });

    return await handleResponse(response);
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export {
  addOrder,
  addGuestOrder,
  createPaymentIntent,
  addRazorpayOrder,
  createOrderByRazorPay,
  getOrderCustomer,
  getOrderById,
  sendEmailInvoiceToCustomer,
};
