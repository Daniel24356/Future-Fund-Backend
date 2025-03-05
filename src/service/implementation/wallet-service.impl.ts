import { Transaction } from "@prisma/client";
import { WalletService } from "../wallet.service";


export class WalletServiceImpl implements WalletService{
    getUserBalance(userId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    depositFunds(userId: string, amount: number, description?: string): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }
    withdrawFunds(userId: string, amount: number, description?: string): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }
    transferFunds(senderId: string, receiverEmail: string, amount: number): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }
    getUserTransactions(userId: string): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }
}