import express from "express";
import { TransactionController } from "../controllers/Transaction.controller";

const epinsrouter = express.Router();
const transactionController = new TransactionController();

epinsrouter.post("/buy-airtime", transactionController.buyAirtime);
epinsrouter.post("/buy-data", transactionController.buyData);
epinsrouter.post("/validate-meter", transactionController.validateMeter);
epinsrouter.post("/generate-electricity-token", transactionController.generateElectricityToken);
epinsrouter.post("/validate-betting-account", transactionController.validateBettingAccount);
epinsrouter.post("/top-up-betting-account", transactionController.topUpBettingAccount);

export default epinsrouter;
