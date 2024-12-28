"use client";
import { useParams } from "next/navigation";

export default function CartPage() {
  const params = useParams();
  const productId = params.productId;

  const submitOrder = async () => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "current-user-id", // You'll need to get this from your auth system
        totalAmount: 0, // You'll need to calculate this based on the product price
        shippingAddress: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
        },
        products: [{ productId, quantity: 1 }],
      }),
    });

    if (response.ok) {
      // Handle successful order creation
      // Redirect to order confirmation page
    }
  };
  return (
    <div>
      <h1>Cart</h1>
      {/* Add your cart UI here */}
      <button onClick={submitOrder}>Submit Order</button>
    </div>
  );
}
