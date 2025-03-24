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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServiceImpl = void 0;
const axios_1 = __importDefault(require("axios"));
const customError_error_1 = require("../../exceptions/error/customError.error");
// Implementation of PaymentService using Paystack's API.
class PaymentServiceImpl {
    constructor() {
        this.PAYSTACK_BASE_URL = "https://api.paystack.co";
        this.PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // ✅ Fixed variable name
        this.PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL; // ✅ Consistency fix
    }
    // ✅ Initialize Payment
    initializePayment(email_1, amount_1) {
        return __awaiter(this, arguments, void 0, function* (email, amount, metadata = {}) {
            var _a, _b;
            try {
                const response = yield axios_1.default.post(`${this.PAYSTACK_BASE_URL}/transaction/initialize`, {
                    email,
                    amount: amount * 100, // Convert amount to kobo
                    callback_url: this.PAYSTACK_CALLBACK_URL,
                    metadata,
                }, {
                    headers: {
                        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.data.status) {
                    throw new customError_error_1.CustomError(400, response.data.message || "Failed to initialize payment");
                }
                return response.data.data;
            }
            catch (error) {
                console.error("Error in initializePayment:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new customError_error_1.CustomError(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500, "Payment initialization failed");
            }
        });
    }
    // ✅ Verify Payment
    verifyPayment(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield axios_1.default.get(`${this.PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
                    headers: {
                        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
                    },
                });
                return response.data.data.status === "success"; // ✅ Return boolean instead of throwing an error
            }
            catch (error) {
                console.error("Error in verifyPayment:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                return false; // ✅ Instead of throwing an error, return false
            }
        });
    }
}
exports.PaymentServiceImpl = PaymentServiceImpl;
