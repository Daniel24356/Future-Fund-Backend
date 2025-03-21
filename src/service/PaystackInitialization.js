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
const customError_error_1 = require("../exceptions/error/customError.error");
const PAYSTACK_SECRET_KEY = "sk_test_837fb861720009a8f9d6be73b09b678d720235e2";
class PaymentServiceImpl {
    initializePayment(email, amount, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", {
                    email,
                    amount: amount * 100,
                    metadata
                }, {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.data.status) {
                    throw new customError_error_1.CustomError(400, response.data.message || "Failed to initialie payment");
                }
                return response.data.data;
            }
            catch (error) {
                console.error("Error in PaymentService.initializePayment:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new customError_error_1.CustomError(400, "Failed to initialize payment");
            }
        });
    }
}
exports.PaymentServiceImpl = PaymentServiceImpl;
