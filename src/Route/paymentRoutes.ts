import express from "express";
import { PaymentController } from "../controllers/paystackController";
import { paystackWebhook } from "../controllers/payWebhookController";

const router = express.Router();
const paymentController = new PaymentController();

router.post("/paystack/initiate", paymentController.initiatePayment);
router.get("/paystack/verify/:reference", paymentController.verifyPayment);
router.post("/paystack/webhook", express.raw({ type: "application/json" }), paystackWebhook);

export default router;
