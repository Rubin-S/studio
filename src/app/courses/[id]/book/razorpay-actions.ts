'use server';
import Razorpay from 'razorpay';
import { z } from 'zod';
import crypto from 'crypto';

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("Razorpay API keys are not set. Payment functionality will be disabled.");
}

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amount: number) {
    const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit (paise for INR)
        currency: "INR",
        receipt: `receipt_order_${new Date().getTime()}`,
    };
    try {
        const order = await razorpay.orders.create(options);
        return { success: true, order };
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return { success: false, error: "Failed to create order." };
    }
}

const verificationSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
});

export async function verifyRazorpaySignature(data: z.infer<typeof verificationSchema>) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verificationSchema.parse(data);
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');
        
        if (expectedSignature === razorpay_signature) {
            return { success: true, message: "Payment verified successfully" };
        } else {
            return { success: false, message: "Invalid signature" };
        }
    } catch (error) {
        console.error("Error verifying signature:", error);
        if (error instanceof z.ZodError) {
            return { success: false, message: "Invalid data format." };
        }
        return { success: false, message: "Signature verification failed." };
    }
}
