import express from "express"
import { BillPaymentController } from "../controllers/billpayment.controller";


const billpaymentcontroller = new   BillPaymentController();
const billpaymentRouter = express.Router();

billpaymentRouter.post("/", billpaymentcontroller.payBill)
billpaymentRouter.get("/getUserPayment",billpaymentcontroller.getUserBillPayments);

export default billpaymentRouter;