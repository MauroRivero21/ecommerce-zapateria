import type { Metadata } from "next";
import { OrderSuccess } from "@/components/order-success";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string; demo?: string }>;
}) {
  const params = await searchParams;

  return (
    <OrderSuccess
      reference={params.pedido ?? ""}
      demo={params.demo === "1"}
    />
  );
}
