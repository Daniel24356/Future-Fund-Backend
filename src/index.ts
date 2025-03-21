import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import userRouter from "./Route/userRouter";
import { errorHandler } from "./exceptions/error/errorHandler";
import authRouter from "./Route/authRouth";
import otpRouter from "./Route/otpRoute";
import { setupSwagger } from "./configs/swagger";
import billpaymentRouter from "./Route/billPaymentRouter";
import contributionRouter from "./Route/contributionRouter";
import investmentRouter from "./Route/investmentRouter";
import loanRouter from "./Route/loanRouter";
import walletRouter from "./Route/walletRouter";
// import "./Jobs/LoanPayment.job"; 
import epinsrouter from "./Route/transactionRoutes";
import router from "./Route/paymentRoutes";

dotenv.config();          

const portEnv = process.env.PORT;
if(!portEnv){
   console.error("Error: PORT is not defined in .env file");
   process.exit(1);
}

const PORT:number = parseInt(portEnv, 10);
if(isNaN(PORT)){
   console.error("Error: PORT is not a number in .env file");
   process.exit(1);
}

const app = express();
const corsOptions = {
    origin:
    "*",
    Credentials: true,
    allowedHeaders: "*",
    methods:"GET, HEAD, PUT, PATCH, POST, DELETE"
};

app.use(cors(corsOptions));

app.use(express.json());

setupSwagger(app);

app.use("/api/v1/users", userRouter)
app.use("/api/v1/login", authRouter)
app.use("/api/v1/otp", otpRouter)
app.use("/api/v1/bill", billpaymentRouter)
app.use("/api/v1/contribution", contributionRouter)
app.use("/api/v1/investment", investmentRouter)
app.use("/api/v1/loan", loanRouter)
app.use("/api/v1/wallet", walletRouter)
app.use("/api/v1/transactions", epinsrouter);
app.use("/api/v1", router)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})