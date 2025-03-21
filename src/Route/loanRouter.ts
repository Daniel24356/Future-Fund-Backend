import express from "express";
import { LoanController } from "../controllers/loan.controller";
import { authenticateUser } from "../Middleware/auth.middleware"; 
import { uploadSingle } from "../Middleware/uploadMiddleware"; 




const loanController = new LoanController(); 
const loanRouter = express.Router();

loanRouter.post("/", authenticateUser, uploadSingle, loanController.applyForLoan);
loanRouter.get("/getUserloans", authenticateUser, loanController.getUserLoans);
loanRouter.post("/repayloan", authenticateUser, loanController.repayLoan);
loanRouter.post("/updateloanStatus", authenticateUser, loanController.updateLoanStatus);

export default loanRouter;



