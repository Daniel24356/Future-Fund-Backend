import express from "express"
import { WalletController } from "../controllers/wallet.controller";


const walletcontroller = new WalletController();
const walletRouter = express.Router();

walletRouter.post("/", walletcontroller.depositFunds)
walletRouter.get("/getUserBalance", walletcontroller.getUserBalance);
walletRouter.get("/getUserTransactions",walletcontroller.getUserTransactions);
walletRouter.post("/transferFunds",walletcontroller.transferFunds);
walletRouter.post("/withdrawal",walletcontroller.withdrawFunds);

export default walletRouter;