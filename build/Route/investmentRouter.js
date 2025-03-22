"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const investment_controller_1 = require("../controllers/investment.controller");
const investmentcontroller = new investment_controller_1.InvestmentController();
const investmentRouter = express_1.default.Router();
investmentRouter.post("/", investmentcontroller.invest);
investmentRouter.get("/getUserInvestment", investmentcontroller.getUserInvestments);
exports.default = investmentRouter;
