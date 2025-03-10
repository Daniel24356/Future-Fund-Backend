import express from "express";
import { LoanController } from "../controllers/loan.controller";
import { authenticateUser } from "../Middleware/auth.middleware";

const loancontroller = new LoanController();
const loanRouter = express.Router();

loanRouter.post("/", loancontroller.applyForLoan)
loanRouter.get("/getUserloans",authenticateUser, loancontroller.getUserLoans);
loanRouter.post("/repayloan", loancontroller.repayLoan);
loanRouter.patch("/update-loan-status", loancontroller.updateLoanStatus); 

export default loanRouter;
