import express from "express"
import { VTPASSController } from "../controllers/vTPassContoller";

const vtpasscontroller = new   VTPASSController();
const vtpassRouter = express.Router();

vtpassRouter.post("/airtime", vtpasscontroller.airtimePurchase);
vtpassRouter.post("/data", vtpasscontroller.dataPurchase);
vtpassRouter.post("/verifyMeter", vtpasscontroller.verifyMeter);
vtpassRouter.post("/electricity", vtpasscontroller.electricityPayment);

// Betting Wallet Funding
// vtpassRouter.post("/betting", vtpasscontroller.bettingFunding);

export default vtpassRouter;
