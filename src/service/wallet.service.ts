import { Transaction, User } from "@prisma/client";
import { PaymentInitializationResponse } from "./PaystackInitialization";
import { TransferFundsDTO } from "../dto/wallet.dto";

export interface WalletService {
  getUserBalance(userId: string): Promise<number>;
  depositFunds(userId: string, amount: number, description?: string): Promise<{transaction: Transaction, paymentResponse: PaymentInitializationResponse}>;
  withdrawFunds(userId: string, amount: number, description?: string): Promise<Transaction>;
  transferFunds(data: TransferFundsDTO): Promise<Transaction|undefined>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
}
