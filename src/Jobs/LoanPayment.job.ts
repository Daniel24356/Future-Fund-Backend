import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import winston from "winston";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const cronSchedule = process.env.CRON_SCHEDULE || "0 0 * * *"; // Default: Run every midnight

let isRunning = false;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/cron.log" }), 
    new winston.transports.Console(), 
  ],
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendEmail(to: string, subject: string, text: string) {
  if (!to) return; 
  try {
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    logger.error(`Email failed to ${to}: ${error}`);
  }
}

async function sendSMS(to: string | null, message: string) {
  if (!to) return; 
  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body: message,
    });
    logger.info(`SMS sent to ${to}`);
  } catch (error) {
    logger.error(`SMS failed to ${to}: ${error}`);
  }
}

cron.schedule(cronSchedule, async () => {
  if (isRunning) {
    logger.info("Previous cron job is still running. Skipping this execution.");
    return;
  }

  isRunning = true;
  logger.info("Running loan repayment cron job...");

  try {
    const dueLoans = await prisma.loan.findMany({
      where: { status: "ACTIVE", dueDate: { lte: new Date() } },
      include: { user: true },
    });

    for (const loan of dueLoans) {
      const amountToPay = loan.totalRepayable - loan.paidAmount;
      const user = loan.user;

      if (loan.autoPaymentEnabled) {
        const userBalance = await prisma.user.findUnique({
          where: { id: loan.userId },
          select: { balance: true },
        });

        if (!userBalance || userBalance.balance < amountToPay) {
          logger.warn(`Insufficient funds for Loan ID: ${loan.id}`);
          await sendEmail(user.email, "Loan Repayment Failed", `You do not have enough funds to auto-repay your loan ${loan.id}. Please fund your account.`);
          await sendSMS(user.phoneNumber, `Loan repayment failed for Loan ID: ${loan.id}. Please fund your account.`);
          continue;
        }

        await prisma.$transaction([
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
        await sendEmail(user.email, "Loan Repayment Successful", `Your loan ${loan.id} has been auto-repaid successfully.`);
        await sendSMS(user.phoneNumber, `Loan repayment of ${amountToPay} was successful.`);
      } else {
        logger.info(`Reminder sent to User ID: ${loan.userId} for Loan ID: ${loan.id}`);
        await sendEmail(user.email, "Loan Repayment Reminder", `Your loan ${loan.id} is due for repayment.`);
        await sendSMS(user.phoneNumber, `Reminder: Your loan ${loan.id} is due for repayment.`);
      }
    }
  } catch (error) {
    logger.error(`Error running loan repayment cron job: ${error}`);
  } finally {
    isRunning = false;
  }
});
