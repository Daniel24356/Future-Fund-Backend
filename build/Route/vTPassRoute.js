"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vTPassContoller_1 = require("../controllers/vTPassContoller");
const vtpasscontroller = new vTPassContoller_1.VTPASSController();
const vtpassRouter = express_1.default.Router();
vtpassRouter.post("/airtime", vtpasscontroller.airtimePurchase);
vtpassRouter.post("/data", vtpasscontroller.dataPurchase);
vtpassRouter.post("/verifyMeter", vtpasscontroller.verifyMeter);
vtpassRouter.post("/electricity", vtpasscontroller.electricityPayment);
// Betting Wallet Funding
// vtpassRouter.post("/betting", vtpasscontroller.bettingFunding);
exports.default = vtpassRouter;
