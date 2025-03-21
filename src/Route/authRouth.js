"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_user_1 = require("../controllers/auth.controller.user");
const authcontroller = new auth_controller_user_1.AuthController();
const authRouter = express_1.default.Router();
authRouter.post("/", authcontroller.login);
authRouter.post("/sign-up", authcontroller.createUser);
authRouter.post("/verify-email", authcontroller.verifyEmail);
exports.default = authRouter;
