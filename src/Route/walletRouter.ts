import express from "express"
import { WalletController } from "../controllers/wallet.controller";


const walletcontroller = new WalletController();
const walletRouter = express.Router();

walletRouter.post("/", walletcontroller.depositFunds)
walletRouter.get("/getUserBalance/:userId", walletcontroller.getUserBalance);
walletRouter.get("/getUserTransactions/:userId",walletcontroller.getUserTransactions);
walletRouter.post("/transferFunds",walletcontroller.transferFunds);
walletRouter.post("/withdrawal",walletcontroller.withdrawFunds);

export default walletRouter;