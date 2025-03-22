"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("../controllers/wallet.controller");
const walletcontroller = new wallet_controller_1.WalletController();
const walletRouter = express_1.default.Router();
walletRouter.post("/", walletcontroller.depositFunds);
walletRouter.get("/getUserBalance/:userId", walletcontroller.getUserBalance);
walletRouter.get("/getUserTransactions/:userId", walletcontroller.getUserTransactions);
walletRouter.post("/transferFunds", walletcontroller.transferFunds);
walletRouter.post("/withdrawal", walletcontroller.withdrawFunds);
exports.default = walletRouter;
