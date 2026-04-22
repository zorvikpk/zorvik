import Link from "next/link";

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-xl rounded border bg-white p-6 text-center">
      <h1 className="text-2xl font-semibold text-green-700">Order Confirmed</h1>
      <p className="mt-2">Your order ID is:</p>
      <p className="mt-1 font-mono text-lg">{params.id}</p>
      <Link className="mt-4 inline-block underline" href="/track">Track this order</Link>
    </div>
  );
}
