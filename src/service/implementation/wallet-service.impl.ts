import { Transaction, PrismaClient, TransactionType } from "@prisma/client";
import { WalletService } from "../wallet.service";

const prisma = new PrismaClient()
export class WalletServiceImpl implements WalletService{
   async getUserBalance(userId: string): Promise<number> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found");
        }
        return user.balance;
    }
    depositFunds(userId: string, amount: number, description?: string): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }
    async withdrawFunds(userId: string, amount: number, description?: string): Promise<Transaction> {
        if (amount <= 0) {
            throw new Error("Invalid withdrawal amount.");
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found");
        }

        if (user.balance < amount) {
            throw new Error("Insufficient funds.");
        }

        // Deduct balance and create transaction
        const transaction = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } },
            });

            return await tx.transaction.create({
                data: {
                    userId,
                    type: TransactionType.WITHDRAWAL,
                    amount,
                    description: description || "Withdrawal",
                },
            });
        });

        return transaction;
    }
    transferFunds(senderId: string, receiverEmail: string, amount: number): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }
   async getUserTransactions(userId: string): Promise<Transaction[]> {
       const transactions = await prisma.transaction.findMany({
        where: {userId},
        orderBy: {createdAt: "desc"}
       })
       return transactions
    }
}