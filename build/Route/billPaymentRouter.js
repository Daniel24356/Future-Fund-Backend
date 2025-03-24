"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billpayment_controller_1 = require("../controllers/billpayment.controller");
const billpaymentcontroller = new billpayment_controller_1.BillPaymentController();
const billpaymentRouter = express_1.default.Router();
billpaymentRouter.post("/", billpaymentcontroller.payBill);
billpaymentRouter.get("/getUserPayment", billpaymentcontroller.getUserBillPayments);
exports.default = billpaymentRouter;
