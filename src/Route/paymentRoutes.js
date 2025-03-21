"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paystackController_1 = require("../controllers/paystackController");
const payWebhookController_1 = require("../controllers/payWebhookController");
const router = express_1.default.Router();
const paymentController = new paystackController_1.PaymentController();
router.post("/paystack/initiate", paymentController.initiatePayment);
router.get("/paystack/verify/:reference", paymentController.verifyPayment);
router.post("/paystack/webhook", express_1.default.raw({ type: "application/json" }), payWebhookController_1.paystackWebhook);
exports.default = router;
