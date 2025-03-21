"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loan_controller_1 = require("../controllers/loan.controller");
const auth_middleware_1 = require("../Middleware/auth.middleware");
const loancontroller = new loan_controller_1.LoanController();
const loanRouter = express_1.default.Router();
loanRouter.post("/", auth_middleware_1.authenticateUser, loancontroller.applyForLoan);
loanRouter.get("/getUserloans", auth_middleware_1.authenticateUser, loancontroller.getUserLoans);
loanRouter.post("/repayloan", auth_middleware_1.authenticateUser, loancontroller.repayLoan);
loanRouter.post("/updateloanStatus", auth_middleware_1.authenticateUser, loancontroller.updateLoanStatus);
exports.default = loanRouter;
