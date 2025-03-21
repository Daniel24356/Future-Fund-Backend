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
exports.WalletController = void 0;
const wallet_service_impl_1 = require("../service/implementation/wallet-service.impl");
class WalletController {
    constructor() {
        this.getUserBalance = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const balance = yield this.walletService.getUserBalance(userId);
                res.status(200).json({ balance });
            }
            catch (error) {
                next(error);
            }
        });
        this.depositFunds = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("first");
            }
            catch (error) {
                next(error);
            }
        });
        this.withdrawFunds = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, amount, description } = req.body;
                const transaction = yield this.walletService.withdrawFunds(userId, amount, description);
                res.status(201).json(transaction);
            }
            catch (error) {
                next(error);
            }
        });
        this.transferFunds = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const transaction = yield this.walletService.transferFunds(data);
                res.status(200).json(transaction);
            }
            catch (error) {
                next(error);
            }
        });
        this.getUserTransactions = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const transactions = yield this.walletService.getUserTransactions(userId);
                res.status(200).json(transactions);
            }
            catch (error) {
                next(error);
            }
        });
        this.walletService = new wallet_service_impl_1.WalletServiceImpl();
    }
}
exports.WalletController = WalletController;
