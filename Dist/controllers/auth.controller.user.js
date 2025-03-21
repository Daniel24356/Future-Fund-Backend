"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_implementation_1 = require("../service/implementation/auth.service.implementation");
class AuthController {
    constructor() {
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { accessToken, refreshToken } = yield this.authService.login(data);
                res.status(200).json({ accessToken, refreshToken });
            }
            catch (error) {
                next(error);
            }
        });
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const user = yield this.authService.createUser(data);
                res.status(201).json({
                    error: false,
                    message: `Otp has been sent successfully to your email @ ${user.email}`,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const user = yield this.authService.verifyEmail(data);
                res.status(201).json({
                    error: false,
                    message: `You have successfully registered`,
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.authService = new auth_service_implementation_1.AuthServiceImp();
    }
}
exports.AuthController = AuthController;
