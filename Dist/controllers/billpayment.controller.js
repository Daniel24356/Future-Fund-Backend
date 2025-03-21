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
exports.BillPaymentController = void 0;
const billpayment_service_impl_1 = require("../service/implementation/billpayment-service.impl");
class BillPaymentController {
    constructor() {
        this.payBill = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("first");
            }
            catch (error) {
                next(error);
            }
        });
        this.getUserBillPayments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("first");
            }
            catch (error) {
                next(error);
            }
        });
        this.billService = new billpayment_service_impl_1.BillPaymentServiceImpl();
    }
}
exports.BillPaymentController = BillPaymentController;
