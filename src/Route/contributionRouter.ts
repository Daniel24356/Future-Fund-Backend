import express from "express"
import { ContributionController } from "../controllers/contribution.controller";
import { authenticateUser } from "../Middleware/auth.middleware";


const contributioncontroller = new ContributionController();
const contributionRouter = express.Router();

contributionRouter.post("/", contributioncontroller.createContribution)
contributionRouter.get("/getUserContribution/:userId", contributioncontroller.getUserContributions);
contributionRouter.post("/joinContribution", contributioncontroller.joinContribution);
contributionRouter.post("/payContribution", contributioncontroller.payContribution);
contributionRouter.get("/members/:contributionId", contributioncontroller.getAllContributionMembers)
contributionRouter.post("/invite", authenticateUser, contributioncontroller.inviteUsersToContribution);
contributionRouter.post("/join", authenticateUser, contributioncontroller.joinContribution);
contributionRouter.post("/agree", authenticateUser, contributioncontroller.agreeToPaymentTerms);
contributionRouter.post("/assign", authenticateUser, contributioncontroller.assignContributionTurns);
contributionRouter.post("/start", authenticateUser, contributioncontroller.startContributionCycle);
contributionRouter.post("/enforce-trust", authenticateUser, contributioncontroller.enforceTrustBuildingPeriod);
contributionRouter.post("/payouts", authenticateUser, contributioncontroller.processPayouts);
contributionRouter.post("/penalize", authenticateUser, contributioncontroller.penalizeLatePayers);
contributionRouter.post("/reassign", authenticateUser, contributioncontroller.reassignForfeitedSpots);
contributionRouter.post("/finalize", authenticateUser, contributioncontroller.finalizeContributionCycle);

export default contributionRouter;