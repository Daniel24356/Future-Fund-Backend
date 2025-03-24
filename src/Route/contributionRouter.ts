import express from "express"
import { ContributionController } from "../controllers/contribution.controller";
import { authenticateUser } from "../Middleware/auth.middleware";


const contributioncontroller = new ContributionController();
const contributionRouter = express.Router();

contributionRouter.post("/", authenticateUser, contributioncontroller.createContribution)
contributionRouter.get("/getUserContribution/:userId", authenticateUser, contributioncontroller.getUserContributions);
contributionRouter.post("/joinContribution", contributioncontroller.joinContribution);
contributionRouter.post("/:contributionId/payContribution", contributioncontroller.payContribution);
contributionRouter.get("/members/:contributionId", contributioncontroller.getAllContributionMembers)
contributionRouter.post("/:contributionId/invite", authenticateUser, contributioncontroller.inviteUsersToContribution);
contributionRouter.post("/:contributionId/join", authenticateUser, contributioncontroller.joinContribution);
contributionRouter.post("/agree", authenticateUser, contributioncontroller.agreeToPaymentTerms);
contributionRouter.post("/assign", authenticateUser, contributioncontroller.assignContributionTurns);
contributionRouter.post("/:contributionId/start", authenticateUser, contributioncontroller.startContributionCycle);
contributionRouter.post("/enforce-trust", authenticateUser, contributioncontroller.enforceTrustBuildingPeriod);
contributionRouter.post("/payouts", authenticateUser, contributioncontroller.processPayouts);
contributionRouter.post("/:contributionId/:member/penalize", authenticateUser, contributioncontroller.penalizeLatePayers);
contributionRouter.post("/reassign", authenticateUser, contributioncontroller.reassignForfeitedSpots);
contributionRouter.post("/finalize", authenticateUser, contributioncontroller.finalizeContributionCycle);

export default contributionRouter;