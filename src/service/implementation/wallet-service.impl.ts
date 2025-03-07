import { DepositStatus, Transaction, TransactionType } from "@prisma/client";
import { WalletService } from "../wallet.service";
import { PaymentInitializationResponse, PaymentServiceImpl } from "../PaystackInitialization";
import { db } from "../../configs/db";
import { CustomError } from "../../exceptions/error/customError.error";


export class WalletServiceImpl implements WalletService{
    private paymentService = new PaymentServiceImpl();

    getUserBalance(userId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    async depositFunds(userId: string, amount: number, description?: string): Promise<{transaction: Transaction, paymentResponse: PaymentInitializationResponse}> {
        const findUser = await db.user.findUnique({
            where: {id: userId}
        })
        if(!findUser) {
            throw new CustomError(404, "User not found");
        }
        const paymentResponse = await this.paymentService.initializePayment(
            findUser.email,
            amount,
            { transactionType: TransactionType.DEPOSIT }
        )
        const transaction = await db.transaction.create({
            data: {
                userId: findUser.id,
                type: TransactionType.DEPOSIT,
                status: DepositStatus.PENDING,
                amount,
            }
        })
        return {transaction, paymentResponse};
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