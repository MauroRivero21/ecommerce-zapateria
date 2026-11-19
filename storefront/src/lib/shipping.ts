import { site } from "./config";
import type { PaymentMethod, ShippingMethod } from "./types";

export const shippingCost = (subtotal: number, method: ShippingMethod) => {
  if (method === "express") return site.expressShipping;
  return subtotal >= site.freeShippingThreshold ? 0 : site.standardShipping;
};

export const paymentFee = (method: PaymentMethod) =>
  method === "cod" ? site.cashOnDeliveryFee : 0;

export const orderTotal = (
  subtotal: number,
  shippingMethod: ShippingMethod,
  paymentMethod: PaymentMethod,
) => subtotal + shippingCost(subtotal, shippingMethod) + paymentFee(paymentMethod);
