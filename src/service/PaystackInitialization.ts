import axios from "axios";
import { CustomError } from "../exceptions/error/customError.error";

const PAYSTACK_SECRET_KEY = "sk_test_837fb861720009a8f9d6be73b09b678d720235e2";

export interface PaymentInitializationResponse {
    authorization_url: string;
    reference: string;
}

export interface PaymentService {
    initializePayment (email: string, amount: number, metadata?: object): Promise<PaymentInitializationResponse>;
}

export class PaymentServiceImpl implements PaymentService {
    async initializePayment(email: string, amount: number, metadata?: object): Promise<PaymentInitializationResponse> {
        try {
            const response = await axios.post("https://api.paystack.co/transaction/initialize",
                {
                    email,
                    amount: amount * 100,
                    metadata
                },
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            if(!response.data.status) {
                throw new CustomError(400, response.data.message || "Failed to initialie payment");
            }

            return response.data.data as PaymentInitializationResponse;

        } catch (error: any) {
            console.error("Error in PaymentService.initializePayment:", error.response?.data || error.message);
            throw new CustomError(400, "Failed to initialize payment");
        }
    }
    
}