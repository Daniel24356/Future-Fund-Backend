import axios from "axios";
import { CustomError } from "../../exceptions/error/customError.error";

// Define the response structure returned by Paystack's initialize payment endpoint.
export interface PaymentInitializationResponse {
  authorization_url: string;
  reference: string;
}

// Define the PaymentService interface
export interface PaymentService {
  initializePayment(email: string, amount: number, metadata?: object): Promise<PaymentInitializationResponse>;
  verifyPayment(reference: string): Promise<boolean>;
}

// Implementation of PaymentService using Paystack's API.
export class PaymentServiceImpl implements PaymentService {
  private PAYSTACK_BASE_URL = "https://api.paystack.co";
  private PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // ✅ Fixed variable name
  private PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL; // ✅ Consistency fix

  // ✅ Initialize Payment
  async initializePayment(email: string, amount: number, metadata: object = {}): Promise<PaymentInitializationResponse> {
    try {
      const response = await axios.post(
        `${this.PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // Convert amount to kobo
          callback_url: this.PAYSTACK_CALLBACK_URL,
          metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.status) {
        throw new CustomError(400, response.data.message || "Failed to initialize payment");
      }

      return response.data.data as PaymentInitializationResponse;
    } catch (error: any) {
      console.error("Error in initializePayment:", error.response?.data || error.message);
      throw new CustomError(error.response?.status || 500, "Payment initialization failed");
    }
  }

  // ✅ Verify Payment
  async verifyPayment(reference: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      return response.data.data.status === "success"; // ✅ Return boolean instead of throwing an error
    } catch (error: any) {
      console.error("Error in verifyPayment:", error.response?.data || error.message);
      return false; // ✅ Instead of throwing an error, return false
    }
  }
}
