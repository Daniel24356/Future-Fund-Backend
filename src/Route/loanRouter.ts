import express from "express";
import { LoanController } from "../controllers/loan.controller";

const loancontroller = new LoanController();
const loanRouter = express.Router();

loanRouter.post("/", loancontroller.applyForLoan);
loanRouter.get("/getUserloans", loancontroller.getUserLoans);
loanRouter.post("/repayloan", loancontroller.repayLoan);
loanRouter.patch("/update-loan-status", loancontroller.updateLoanStatus); 

export default loanRouter;
