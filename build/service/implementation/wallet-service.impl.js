"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletServiceImpl = void 0;
const client_1 = require("@prisma/client");
const PaystackInitialization_1 = require("../PaystackInitialization");
const db_1 = require("../../configs/db");
const customError_error_1 = require("../../exceptions/error/customError.error");
const prisma = new client_1.PrismaClient();
class WalletServiceImpl {
    constructor() {
        this.paymentService = new PaystackInitialization_1.PaymentServiceImpl();
    }
    getUserBalance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error("User not found");
            }
            return user.balance;
        });
    }
    // async depositFunds(userId: string, amount: number, description?: string): Promise<{transaction: Transaction, paymentResponse: PaymentInitializationResponse}> {
    //     const findUser = await db.user.findUnique({
    //         where: {id: userId}
    //     })
    //     if(!findUser) {
    //         throw new CustomError(404, "User not found");
    //     }
    //     const paymentResponse = await this.paymentService.initializePayment(
    //         findUser.email,
    //         amount,
    //         { transactionType: TransactionType.DEPOSIT }
    //     )
    //     const transaction = await db.transaction.create({
    //         data: {
    //             userId: findUser.id,
    //             type: TransactionType.DEPOSIT,
    //             status: DepositStatus.PENDING,
    //             amount,
    //         }
    //     })
    //     return {transaction, paymentResponse};
    // }
    withdrawFunds(userId, amount, description) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0) {
                throw new Error("Invalid withdrawal amount.");
            }
            const user = yield prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error("User not found");
            }
            if (user.balance < amount) {
                throw new Error("Insufficient funds.");
            }
            // Deduct balance and create transaction
            const transaction = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.user.update({
                    where: { id: userId },
                    data: { balance: { decrement: amount } },
                });
                return yield tx.transaction.create({
                    data: {
                        userId,
                        type: client_1.TransactionType.WITHDRAWAL,
                        amount,
                        description: description || "Withdrawal",
                    },
                });
            }));
            return transaction;
        });
    }
    transferFunds(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.amount <= 0) {
                throw new customError_error_1.CustomError(400, "Amount must be greater than 0");
            }
            try {
                const newTransaction = yield db_1.db.$transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const findSender = yield db_1.db.user.findUnique({
                        where: { id: data.senderId }
                    });
                    if (!findSender) {
                        throw new customError_error_1.CustomError(404, "Sender not found");
                    }
                    if (findSender.balance < data.amount) {
                        throw new customError_error_1.CustomError(400, "Insufficient balance");
                    }
                    const findReceiver = yield db_1.db.user.findUnique({
                        where: { email: data.receiverEmail }
                    });
                    if (!findReceiver) {
                        throw new customError_error_1.CustomError(404, "Receiver not found");
                    }
                    yield db_1.db.user.update({
                        where: { id: data.senderId },
                        data: { balance: findSender.balance - data.amount }
                    });
                    yield db_1.db.user.update({
                        where: { email: data.receiverEmail },
                        data: { balance: findReceiver.balance + data.amount }
                    });
                    const transaction = yield db_1.db.transaction.create({
                        data: {
                            userId: data.senderId,
                            type: client_1.TransactionType.DEPOSIT,
                            amount: data.amount,
                            description: `Funds transfer from ${findSender.firstName + ' ' + findSender.lastName} to ${findReceiver.firstName + ' ' + findReceiver.lastName}`
                        }
                    });
                    return transaction;
                }));
                return newTransaction;
            }
            catch (error) {
                throw new customError_error_1.CustomError(400, "Transaction failed");
            }
        });
    }
    getUserTransactions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield prisma.transaction.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" }
            });
            return transactions;
        });
    }
}
exports.WalletServiceImpl = WalletServiceImpl;
