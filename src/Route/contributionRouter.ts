import express from "express"
import { ContributionController } from "../controllers/contribution.controller";
import { authenticateUser } from "../Middleware/auth.middleware";


const contributioncontroller = new ContributionController();
const contributionRouter = express.Router();

contributionRouter.post("/", authenticateUser, contributioncontroller.createContribution)
contributionRouter.get("/getUserContribution/:userId", contributioncontroller.getUserContributions);
contributionRouter.post("/joinContribution", contributioncontroller.joinContribution);
contributionRouter.post("/payContribution", contributioncontroller.payContribution);
contributionRouter.get("/members/:contributionId", contributioncontroller.getAllContributionMembers)

export default contributionRouter;