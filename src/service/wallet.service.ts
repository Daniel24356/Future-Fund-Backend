import { Transaction, User } from "@prisma/client";

export interface WalletService {
  getUserBalance(userId: string): Promise<number>;
  depositFunds(userId: string, amount: number, description?: string): Promise<Transaction>;
  withdrawFunds(userId: string, amount: number, description?: string): Promise<Transaction>;
  transferFunds(senderId: string, receiverEmail: string, amount: number): Promise<Transaction>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
}
