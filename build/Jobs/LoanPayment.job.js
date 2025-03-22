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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const winston_1 = __importDefault(require("winston"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const cronSchedule = process.env.CRON_SCHEDULE || "0 0 * * *"; // Default: Run every midnight
let isRunning = false;
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.json(),
    transports: [
        new winston_1.default.transports.File({ filename: "logs/cron.log" }),
        new winston_1.default.transports.Console(),
    ],
});
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
function sendEmail(to, subject, text) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!to)
            return;
        try {
            yield transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
            logger.info(`Email sent to ${to}: ${subject}`);
        }
        catch (error) {
            logger.error(`Email failed to ${to}: ${error}`);
        }
    });
}
function sendSMS(to, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!to)
            return;
        try {
            yield twilioClient.messages.create({
                from: process.env.TWILIO_PHONE_NUMBER,
                to,
                body: message,
            });
            logger.info(`SMS sent to ${to}`);
        }
        catch (error) {
            logger.error(`SMS failed to ${to}: ${error}`);
        }
    });
}
node_cron_1.default.schedule(cronSchedule, () => __awaiter(void 0, void 0, void 0, function* () {
    if (isRunning) {
        logger.info("Previous cron job is still running. Skipping this execution.");
        return;
    }
    isRunning = true;
    logger.info("Running loan repayment cron job...");
    try {
        const dueLoans = yield prisma.loan.findMany({
            where: { status: "ACTIVE", dueDate: { lte: new Date() } },
            include: { user: true },
        });
        for (const loan of dueLoans) {
            const amountToPay = loan.totalRepayable - loan.paidAmount;
            const user = loan.user;
            if (loan.autoPaymentEnabled) {
                const userBalance = yield prisma.user.findUnique({
                    where: { id: loan.userId },
                    select: { balance: true },
                });
                if (!userBalance || userBalance.balance < amountToPay) {
                    logger.warn(`Insufficient funds for Loan ID: ${loan.id}`);
                    yield sendEmail(user.email, "Loan Repayment Failed", `You do not have enough funds to auto-repay your loan ${loan.id}. Please fund your account.`);
                    yield sendSMS(user.phoneNumber, `Loan repayment failed for Loan ID: ${loan.id}. Please fund your account.`);
                    continue;
                }
                yield prisma.$transaction([
                    prisma.user.update({
                        where: { id: loan.userId },
                        data: { balance: { decrement: amountToPay } },
                    }),
                    prisma.loan.update({
                        where: { id: loan.id },
                        data: {
                            paidAmount: { increment: amountToPay },
                            status: loan.totalRepayable <= loan.paidAmount + amountToPay ? "PAID" : "ACTIVE",
                        },
                    }),
                    prisma.transaction.create({
                        data: {
                            userId: loan.userId,
                            type: "LOAN_REPAYMENT",
                            amount: amountToPay,
                            description: `Auto repayment for loan ${loan.id}`,
                        },
                    }),
                ]);
                logger.info(`Auto payment of ${amountToPay} made for Loan ID: ${loan.id}`);
                yield sendEmail(user.email, "Loan Repayment Successful", `Your loan ${loan.id} has been auto-repaid successfully.`);
                yield sendSMS(user.phoneNumber, `Loan repayment of ${amountToPay} was successful.`);
            }
            else {
                logger.info(`Reminder sent to User ID: ${loan.userId} for Loan ID: ${loan.id}`);
                yield sendEmail(user.email, "Loan Repayment Reminder", `Your loan ${loan.id} is due for repayment.`);
                yield sendSMS(user.phoneNumber, `Reminder: Your loan ${loan.id} is due for repayment.`);
            }
        }
    }
    catch (error) {
        logger.error(`Error running loan repayment cron job: ${error}`);
    }
    finally {
        isRunning = false;
    }
}));
