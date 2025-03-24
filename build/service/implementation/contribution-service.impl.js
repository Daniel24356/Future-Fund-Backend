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
exports.ContributionServiceImpl = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../configs/db");
const customError_error_1 = require("../../exceptions/error/customError.error");
const http_status_codes_1 = require("http-status-codes");
const prisma = new client_1.PrismaClient();
class ContributionServiceImpl {
    //  async getAllContributionMembers(contributionId: string): Promise<ContributionMember[]> {
    //     const contribution= await db.contribution.findFirst({
    //       where: {
    //         id: contributionId
    //       },
    //       include: {
    //         members: true
    //       }
    //     })
    //     if(!contribution){
    //       throw new CustomError(StatusCodes.NOT_FOUND, "Contribution room not found")
    //     }
    //     return contribution.members
    //   }
    getAllContributionMembers(contributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contributionId) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid contribution ID");
            }
            const contribution = yield db_1.db.contribution.findUnique({
                where: {
                    id: contributionId,
                },
                include: {
                    members: true,
                    createdBy: true
                },
            });
            if (!contribution) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Contribution room not found");
            }
            return contribution.members;
        });
    }
    payContribution(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, contributionId, amount } = data;
            const user = yield db_1.db.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
            }
            const contributionMember = yield db_1.db.contributionMember.findFirst({
                where: { userId, contributionId },
                include: { contribution: true },
            });
            if (!contributionMember) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Contribution record not found for this user");
            }
            if (contributionMember.status === client_1.PaymentStatus.PAID) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Contribution is already paid");
            }
            const requiredAmount = contributionMember.contribution.amountPerUser;
            if (amount !== requiredAmount) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid payment amount. Expected ${requiredAmount}`);
            }
            if (user.balance < amount) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Insufficient balance to pay contribution");
            }
            console.log(`Simulating payment of ${amount} for user ${userId} on contribution ${contributionId}`);
            const [updatedUser, updatedContributionMember] = yield db_1.db.$transaction([
                db_1.db.user.update({
                    where: { id: userId },
                    data: { balance: user.balance - amount },
                }),
                db_1.db.contributionMember.update({
                    where: { id: contributionMember.id },
                    data: { status: client_1.PaymentStatus.PAID },
                }),
            ]);
            return updatedContributionMember;
        });
    }
    // async joinContribution(data: JoinContributionDTO): Promise<ContributionMember> {
    //     const isMemberExists = await db.contributionMember.findFirst({
    //         where: {
    //           userId: data.userId,
    //         }
    //     })
    //     if(isMemberExists){
    //         throw new CustomError(StatusCodes.BAD_REQUEST, "User is already a member of this contribution room")
    //     }
    //     const newMember = await db.contributionMember.create({
    //           data: {
    //             userId: data.userId,
    //             contributionId: data.contributionId
    //           }
    //     })
    //     return newMember
    // }
    createContribution(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isContributionExists = yield db_1.db.contribution.findFirst({
                where: {
                    name: data.name,
                }
            });
            if (isContributionExists) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Contribution Room already exists");
            }
            const contributionRoom = yield db_1.db.contribution.create({
                data: {
                    createdById: id,
                    name: data.name,
                    amountPerUser: data.amountPerUser,
                    cycle: data.cycle,
                    maxMembers: data.maxMembers,
                    trustPeriodActive: true, // First 3 months, no payouts
                    escrowBalance: 0,
                }
            });
            return contributionRoom;
        });
    }
    joinContribution(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMemberExists = yield db_1.db.contributionMember.findFirst({
                where: {
                    userId: data.userId,
                },
            });
            if (isMemberExists) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is already a member of this contribution room");
            }
            const newMember = yield db_1.db.contributionMember.create({
                data: {
                    userId: data.userId,
                    contributionId: data.contributionId,
                },
            });
            return newMember;
        });
    }
    getUserContributions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUser = yield db_1.db.user.findFirst({
                where: {
                    id: userId,
                },
            });
            if (!isUser) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "This user doesn't exist");
            }
            const createdContributions = yield db_1.db.contribution.findMany({
                where: { createdById: userId },
            });
            const memberContributions = yield db_1.db.contribution.findMany({
                where: { members: { some: { userId } } },
            });
            const contributions = new Map();
            createdContributions.forEach(contribution => {
                contributions.set(contribution.id, contribution);
            });
            memberContributions.forEach(contribution => {
                contributions.set(contribution.id, contribution);
            });
            return Array.from(contributions.values());
        });
    }
    inviteUsersToContribution(contributionId, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(userIds.map((userId) => __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.contributionInvitation.create({
                    data: { contributionId, userId, status: "PENDING" },
                });
            })));
        });
    }
    verifyIdentityAndJoin(userId, contributionId, verificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "User identity verification failed.");
            }
            const member = yield db_1.db.contributionMember.create({
                data: { userId, contributionId, status: client_1.PaymentStatus.UNPAID },
            });
            return member;
        });
    }
    agreeToPaymentTerms(userId, contributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.contributionMember.updateMany({
                where: { userId, contributionId },
                data: { agreedToTerms: true },
            });
        });
    }
    assignContributionTurns(contributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield db_1.db.contributionMember.findMany({
                where: { contributionId },
                orderBy: { joinedAt: "asc" },
            });
            if (!members.length) {
                throw new Error("No members found for this contribution");
            }
            for (let i = 0; i < members.length; i++) {
                yield db_1.db.contributionMember.update({
                    where: { id: members[i].id },
                    data: { turnOrder: i + 1 },
                });
            }
        });
    }
    startContributionCycle(contributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contribution = yield db_1.db.contribution.findUnique({
                where: { id: contributionId },
                include: { members: true },
            });
            if (!contribution || contribution.members.length === 0) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "No active members to start cycle.");
            }
            yield db_1.db.contribution.update({
                where: { id: contributionId },
                data: { cycleActive: true },
            });
        });
    }
    holdFundsInEscrow(contributionId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const contribution = yield db_1.db.contribution.findUnique({ where: { id: contributionId } });
            if (!contribution)
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Contribution not found.");
            yield db_1.db.contribution.update({
                where: { id: contributionId },
                data: { escrowBalance: contribution.escrowBalance + amount },
            });
        });
    }
    enforceTrustBuildingPeriod(contributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contribution = yield db_1.db.contribution.findUnique({ where: { id: contributionId } });
            if (!contribution)
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Contribution not found.");
            if (contribution.trustPeriodActive) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Payouts are not allowed during the trust period.");
            }
        });
    }
    processPayouts(contributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contribution = yield db_1.db.contribution.findUnique({
                where: { id: contributionId },
                include: { members: true },
            });
            if (!contribution)
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Contribution not found.");
            if (contribution.trustPeriodActive) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Payouts are not allowed during the first 3 months.");
            }
            // Determine next recipient
            const nextPayer = yield db_1.db.contributionMember.findFirst({
                where: { contributionId, status: client_1.PaymentStatus.UNPAID },
                orderBy: { createdAt: "asc" },
            });
            if (!nextPayer)
                return;
            const payoutAmount = contribution.amountPerUser * contribution.members.length;
            yield this.splitPayoutForSecurity(contributionId, payoutAmount);
        });
    }
    splitPayoutForSecurity(contributionId, payoutAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const secureHold = payoutAmount * 0.5; // Hold back 50% for security
            const releaseAmount = payoutAmount - secureHold;
            // Simulate payout and holdback
            yield db_1.db.contribution.update({
                where: { id: contributionId },
                data: { escrowBalance: secureHold },
            });
        });
    }
    penalizeLatePayers(contributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const overdueMembers = yield db_1.db.contributionMember.findMany({
                where: { contributionId, status: client_1.PaymentStatus.UNPAID, dueDate: { lt: new Date() } },
            });
            yield Promise.all(overdueMembers.map((member) => __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.contributionMember.update({
                    where: { id: member.id },
                    data: { penaltyAmount: 100, status: client_1.PaymentStatus.LATE },
                });
            })));
        });
    }
    reassignForfeitedSpots(contributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const forfeitedMembers = yield db_1.db.contributionMember.findMany({
                where: { contributionId, status: client_1.PaymentStatus.LATE },
            });
            yield Promise.all(forfeitedMembers.map((member) => __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.contributionMember.update({
                    where: { id: member.id },
                    data: { forfeited: true },
                });
            })));
        });
    }
    finalizeContributionCycle(contributionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.contribution.update({
                where: { id: contributionId },
                data: { cycleActive: false },
            });
        });
    }
}
exports.ContributionServiceImpl = ContributionServiceImpl;
