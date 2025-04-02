"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contribution_controller_1 = require("../controllers/contribution.controller");
const auth_middleware_1 = require("../Middleware/auth.middleware");
const contributioncontroller = new contribution_controller_1.ContributionController();
const contributionRouter = express_1.default.Router();
contributionRouter.post("/", auth_middleware_1.authenticateUser, contributioncontroller.createContribution);
contributionRouter.get("/getUserContribution/:userId", auth_middleware_1.authenticateUser, contributioncontroller.getUserContributions);
contributionRouter.post("/joinContribution", contributioncontroller.joinContribution);
contributionRouter.post("/payContribution", contributioncontroller.payContribution);
contributionRouter.get("/members/:contributionId", contributioncontroller.getAllContributionMembers);
contributionRouter.post("/invite", auth_middleware_1.authenticateUser, contributioncontroller.inviteUsersToContribution);
contributionRouter.post("/join", auth_middleware_1.authenticateUser, contributioncontroller.joinContribution);
contributionRouter.post("/agree", auth_middleware_1.authenticateUser, contributioncontroller.agreeToPaymentTerms);
contributionRouter.get("/assign/:contributionId", auth_middleware_1.authenticateUser, contributioncontroller.assignContributionTurns);
contributionRouter.post("/start", auth_middleware_1.authenticateUser, contributioncontroller.startContributionCycle);
contributionRouter.post("/enforce-trust", auth_middleware_1.authenticateUser, contributioncontroller.enforceTrustBuildingPeriod);
contributionRouter.post("/payouts", auth_middleware_1.authenticateUser, contributioncontroller.processPayouts);
contributionRouter.post("/penalize", auth_middleware_1.authenticateUser, contributioncontroller.penalizeLatePayers);
contributionRouter.post("/reassign", auth_middleware_1.authenticateUser, contributioncontroller.reassignForfeitedSpots);
contributionRouter.post("/finalize", auth_middleware_1.authenticateUser, contributioncontroller.finalizeContributionCycle);
exports.default = contributionRouter;
