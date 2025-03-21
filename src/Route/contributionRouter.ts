import express from "express"
import { ContributionController } from "../controllers/contribution.controller";


const contributioncontroller = new ContributionController();
const contributionRouter = express.Router();

// contributionRouter.post("/", contributioncontroller.createContribution)
contributionRouter.get("/getUserContribution/:userId", contributioncontroller.getUserContributions);
contributionRouter.post("/joinContribution",contributioncontroller.joinContribution);
contributionRouter.post("/payContribution",contributioncontroller.payContribution);

export default contributionRouter;