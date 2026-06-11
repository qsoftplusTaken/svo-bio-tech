import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData // Client sends the rest of the order data (items, address, etc)
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";

    // Mock verify for dev if mock order
    let isAuthentic = false;
    if (razorpay_order_id.startsWith("order_mock_")) {
      isAuthentic = true;
    } else {
      // Real signature verification
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex");

      isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
      // Save order to Firestore
      const newOrderRef = adminDb.collection("orders").doc();
      const finalOrder = {
        ...orderData,
        id: newOrderRef.id,
        paymentDetails: {
          ...orderData.paymentDetails,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          status: "Paid"
        },
        orderStatus: "Processing",
        createdAt: new Date().toISOString()
      };

      await newOrderRef.set(finalOrder);

      return NextResponse.json({ success: true, orderId: newOrderRef.id }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
