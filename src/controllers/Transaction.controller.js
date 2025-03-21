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
exports.TransactionController = void 0;
const transactionService_1 = require("../service/transactionService");
class TransactionController {
    constructor() {
        // Buy Airtime
        this.buyAirtime = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { network, phone, amount, ref } = req.body;
                if (!network || !phone || !amount || !ref) {
                    res.status(400).json({ message: "Missing required fields" });
                    return;
                }
                const result = yield (0, transactionService_1.buyAirtime)(network, phone, amount, ref);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
        // Buy Data
        this.buyData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { service, MobileNumber, DataPlan, ref } = req.body;
                console.log("Received request:", { service, MobileNumber, DataPlan, ref });
                if (!service || !MobileNumber || !DataPlan || !ref) {
                    res.status(400).json({ message: "Missing required fields" });
                    return;
                }
                const result = yield (0, transactionService_1.buyData)(service, MobileNumber, DataPlan, ref);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
        // Validate Electricity Meter Number
        this.validateMeter = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { service, smartNo, type } = req.body;
                if (!service || !smartNo || !type) {
                    res.status(400).json({ message: "Missing required fields" });
                    return;
                }
                const result = yield (0, transactionService_1.validateMeterNumber)(service, smartNo, type);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
        // Generate Electricity Token
        this.generateElectricityToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { service, accountno, vcode, amount, ref } = req.body;
                if (!service || !accountno || !vcode || !amount || !ref) {
                    res.status(400).json({ message: "Missing required fields" });
                    return;
                }
                const result = yield (0, transactionService_1.generateElectricityToken)(service, accountno, vcode, amount, ref);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
        // Validate Betting Account
        this.validateBettingAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { customerId, service } = req.body;
                if (!customerId || !service) {
                    res.status(400).json({ message: "Missing required fields" });
                    return;
                }
                const result = yield (0, transactionService_1.validateBettingAccount)(customerId, service);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
        // Top-up Betting Account
        this.topUpBettingAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { service, customerId, reference, amount, customerName, request_id } = req.body;
                if (!service || !customerId || !reference || !amount || !customerName || !request_id) {
                    res.status(400).json({ message: "Missing required fields" });
                    return;
                }
                const result = yield (0, transactionService_1.fundBettingAccount)(service, customerId, reference, amount, customerName, request_id);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TransactionController = TransactionController;
