import { DepositStatus, Transaction, TransactionType } from "@prisma/client";
import { WalletService } from "../wallet.service";
import { PaymentInitializationResponse, PaymentServiceImpl } from "../PaystackInitialization";
import { db } from "../../configs/db";
import { CustomError } from "../../exceptions/error/customError.error";
import { TransferFundsDTO } from "../../dto/wallet.dto";


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

    async transferFunds(data: TransferFundsDTO): Promise<Transaction|undefined> {
        if(data.amount <= 0) {
            throw new CustomError(400, "Amount must be greater than 0");
        }
        try {
            const newTransaction = await db.$transaction(async()=>{
                const findSender = await db.user.findUnique({
                    where: {id: data.senderId}
                })
                if(!findSender) {
                    throw new CustomError(404, "Sender not found");
                }
                if(findSender.balance < data.amount) {
                    throw new CustomError(400, "Insufficient balance");
                }

                const findReceiver = await db.user.findUnique({
                    where: {email: data.receiverEmail}
                })
                if(!findReceiver) {
                    throw new CustomError(404, "Receiver not found");
                }

                await db.user.update({
                    where: {id: data.senderId},
                    data: {balance: findSender.balance - data.amount}
                })

                await db.user.update({
                    where: {email: data.receiverEmail},
                    data: {balance: findReceiver.balance + data.amount}
                })

                const transaction = await db.transaction.create({
                    data: {
                        userId: data.senderId,
                        type: TransactionType.DEPOSIT,
                        amount: data.amount,
                        description: `Funds transfer from ${findSender.firstName +' '+ findSender.lastName} to ${findReceiver.firstName +' '+ findReceiver.lastName}`
                    }
                })
                return transaction;
            })
            return newTransaction;

        } catch (error) {
            throw new CustomError(400, "Transaction failed");
        }
    }

    getUserTransactions(userId: string): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }
}