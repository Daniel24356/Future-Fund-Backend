"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Transaction_controller_1 = require("../controllers/Transaction.controller");
const epinsrouter = express_1.default.Router();
const transactionController = new Transaction_controller_1.TransactionController();
epinsrouter.post("/buy-airtime", transactionController.buyAirtime);
epinsrouter.post("/buy-data", transactionController.buyData);
epinsrouter.post("/validate-meter", transactionController.validateMeter);
epinsrouter.post("/generate-electricity-token", transactionController.generateElectricityToken);
epinsrouter.post("/validate-betting-account", transactionController.validateBettingAccount);
epinsrouter.post("/top-up-betting-account", transactionController.topUpBettingAccount);
exports.default = epinsrouter;
