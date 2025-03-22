"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loan_controller_1 = require("../controllers/loan.controller");
const auth_middleware_1 = require("../Middleware/auth.middleware");
const uploadMiddleware_1 = require("../Middleware/uploadMiddleware");
const loanController = new loan_controller_1.LoanController();
const loanRouter = express_1.default.Router();
loanRouter.post("/", auth_middleware_1.authenticateUser, uploadMiddleware_1.uploadSingle, loanController.applyForLoan);
loanRouter.get("/getUserloans", auth_middleware_1.authenticateUser, loanController.getUserLoans);
loanRouter.post("/repayloan", auth_middleware_1.authenticateUser, loanController.repayLoan);
loanRouter.post("/updateloanStatus", auth_middleware_1.authenticateUser, loanController.updateLoanStatus);
loanRouter.get('/getUserActiveLoan', auth_middleware_1.authenticateUser, loanController.getUserActiveLoan);
exports.default = loanRouter;
