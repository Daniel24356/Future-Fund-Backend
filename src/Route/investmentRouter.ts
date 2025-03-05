import express from "express"
import { ContributionController } from "../controllers/contribution.controller";
import { InvestmentController } from "../controllers/investment.controller";


const investmentcontroller = new InvestmentController();
const investmentRouter = express.Router();

investmentRouter.post("/", investmentcontroller.invest)
investmentRouter.get("/getUserInvestment", investmentcontroller.getUserInvestments);


export default investmentRouter;