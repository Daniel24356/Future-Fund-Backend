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
exports.PaymentController = void 0;
const paymentImplementation_1 = require("../service/implementation/paymentImplementation");
class PaymentController {
    constructor() {
        // ✅ Initiate Payment
        this.initiatePayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, amount, userId } = req.body;
                const metadata = { userId };
                const paymentData = yield this.paymentService.initializePayment(email, amount, metadata);
                res.status(200).json({ status: "success", data: paymentData });
            }
            catch (error) {
                next();
            }
        });
        // ✅ Verify Payment
        this.verifyPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { reference } = req.params;
                const isVerified = yield this.paymentService.verifyPayment(reference);
                if (isVerified) {
                    res.status(200).json({ status: "success", message: "Payment verified successfully" });
                }
                else {
                    res.status(400).json({ status: "failed", message: "Payment verification failed" });
                }
            }
            catch (error) {
                next();
            }
        });
        this.paymentService = new paymentImplementation_1.PaymentServiceImpl();
    }
}
exports.PaymentController = PaymentController;
