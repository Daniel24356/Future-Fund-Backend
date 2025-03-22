"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const userRouter_1 = __importDefault(require("./Route/userRouter"));
const errorHandler_1 = require("./exceptions/error/errorHandler");
const authRouth_1 = __importDefault(require("./Route/authRouth"));
const otpRoute_1 = __importDefault(require("./Route/otpRoute"));
const swagger_1 = require("./configs/swagger");
const billPaymentRouter_1 = __importDefault(require("./Route/billPaymentRouter"));
const contributionRouter_1 = __importDefault(require("./Route/contributionRouter"));
const investmentRouter_1 = __importDefault(require("./Route/investmentRouter"));
const loanRouter_1 = __importDefault(require("./Route/loanRouter"));
const walletRouter_1 = __importDefault(require("./Route/walletRouter"));
// import "./Jobs/LoanPayment.job"; 
const transactionRoutes_1 = __importDefault(require("./Route/transactionRoutes"));
const paymentRoutes_1 = __importDefault(require("./Route/paymentRoutes"));
dotenv_1.default.config();
const portEnv = process.env.PORT;
if (!portEnv) {
    console.error("Error: PORT is not defined in .env file");
    process.exit(1);
}
const PORT = parseInt(portEnv, 10);
if (isNaN(PORT)) {
    console.error("Error: PORT is not a number in .env file");
    process.exit(1);
}
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    Credentials: true,
    allowedHeaders: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE"
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
(0, swagger_1.setupSwagger)(app);
app.use("/api/v1/users", userRouter_1.default);
app.use("/api/v1/login", authRouth_1.default);
app.use("/api/v1/otp", otpRoute_1.default);
app.use("/api/v1/bill", billPaymentRouter_1.default);
app.use("/api/v1/contribution", contributionRouter_1.default);
app.use("/api/v1/investment", investmentRouter_1.default);
app.use("/api/v1/loan", loanRouter_1.default);
app.use("/api/v1/wallet", walletRouter_1.default);
app.use("/api/v1/transactions", transactionRoutes_1.default);
app.use("/api/v1", paymentRoutes_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
