import express from "express";
import { LoanController } from "../controllers/loan.controller";
import { authenticateUser } from "../Middleware/auth.middleware"; 

const loancontroller = new LoanController();
const loanRouter = express.Router();

loanRouter.post("/", authenticateUser, loancontroller.applyForLoan);
loanRouter.get("/getUserloans", authenticateUser, loancontroller.getUserLoans);
loanRouter.post("/repayloan", authenticateUser, loancontroller.repayLoan);
loanRouter.post("/updateloanStatus", authenticateUser, loancontroller.updateLoanStatus);
loanRouter.get('/getUserActiveLoan', authenticateUser, loancontroller.getUserActiveLoan);

export default loanRouter;
