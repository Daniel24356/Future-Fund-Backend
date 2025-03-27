"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContributionController = void 0;
const contribution_service_impl_1 = require("../service/implementation/contribution-service.impl");
const http_status_codes_1 = require("http-status-codes");
class ContributionController {
    constructor() {
        this.createContribution = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userAuth || "";
                const contributionData = req.body;
                const newContribution = yield this.contributionService.createContribution(userId, contributionData);
                res.status(201).json(newContribution);
            }
            catch (error) {
                next(error);
            }
        });
        this.joinContribution = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const member = req.body;
                const newMember = yield this.contributionService.joinContribution(member);
                res.status(201).json(newMember);
            }
            catch (error) {
                next(error);
            }
        });
        this.payContribution = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payData = req.body;
                const payment = this.contributionService.payContribution(payData);
                res.status(200).json(payment);
            }
            catch (error) {
                next(error);
            }
        });
        this.getUserContributions = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userAuth || "";
                const contributions = yield this.contributionService.getUserContributions(userId);
                res.status(200).json(contributions);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllContributionMembers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contributionId = req.params.contributionId;
                const members = yield this.contributionService.getAllContributionMembers(contributionId);
                res.status(200).json(members);
            }
            catch (error) {
                next(error);
            }
        });
        this.inviteUsersToContribution = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contributionId, userEmails } = req.body;
                yield this.contributionService.inviteUsersToContribution(contributionId, userEmails);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Users invited successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyIdentityAndJoin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, contributionId, verificationData } = req.body;
                const member = yield this.contributionService.verifyIdentityAndJoin(userId, contributionId, verificationData);
                res.status(http_status_codes_1.StatusCodes.OK).json(member);
            }
            catch (error) {
                next(error);
            }
        });
        this.agreeToPaymentTerms = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, contributionId } = req.body;
                yield this.contributionService.agreeToPaymentTerms(userId, contributionId);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "User agreed to payment terms" });
            }
            catch (error) {
                next(error);
            }
        });
        this.assignContributionTurns = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contributionId } = req.params;
                yield this.contributionService.assignContributionTurns(contributionId);
                res.status(200).json({ message: "Contribution turns assigned successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.startContributionCycle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contributionId } = req.body;
                yield this.contributionService.startContributionCycle(contributionId);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Contribution cycle started" });
            }
            catch (error) {
                next(error);
            }
        });
        this.holdFundsInEscrow = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contributionId, amount } = req.body;
                yield this.contributionService.holdFundsInEscrow(contributionId, amount);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Funds held in escrow" });
            }
            catch (error) {
                next(error);
            }
        });
        this.enforceTrustBuildingPeriod = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contributionId } = req.body;
                yield this.contributionService.enforceTrustBuildingPeriod(contributionId);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Trust-building period enforced" });
            }
            catch (error) {
                next(error);
            }
        });
        this.processPayouts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contributionId } = req.body;
                yield this.contributionService.processPayouts(contributionId);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Payout processed successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.penalizeLatePayers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contributionId } = req.body;
                yield this.contributionService.penalizeLatePayers(contributionId);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Late payers penalized" });
            }
            catch (error) {
                next(error);
            }
        });
        this.reassignForfeitedSpots = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contributionId } = req.body;
                yield this.contributionService.reassignForfeitedSpots(contributionId);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Forfeited spots reassigned" });
            }
            catch (error) {
                next(error);
            }
        });
        this.finalizeContributionCycle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contributionId } = req.body;
                yield this.contributionService.finalizeContributionCycle(contributionId);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Contribution cycle finalized" });
            }
            catch (error) {
                next(error);
            }
        });
        this.contributionService = new contribution_service_impl_1.ContributionServiceImpl();
    }
}
exports.ContributionController = ContributionController;
