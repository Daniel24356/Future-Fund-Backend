import express from "express"
import { ContributionController } from "../controllers/contribution.controller";
import { authenticateUser } from "../Middleware/auth.middleware";


const contributioncontroller = new ContributionController();
const contributionRouter = express.Router();

contributionRouter.post("/", contributioncontroller.createContribution)
contributionRouter.get("/getUserContribution/:userId", contributioncontroller.getUserContributions);
contributionRouter.post("/joinContribution", authenticateUser, contributioncontroller.joinContribution);
contributionRouter.post("/payContribution", authenticateUser, contributioncontroller.payContribution);
contributionRouter.get("/:contributionId/members", contributioncontroller.getAllContributionMembers)

export default contributionRouter;