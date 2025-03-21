"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req === null || req === void 0 ? void 0 : req.headers["authorization"];
        if (!authHeader) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                message: "Authorization required"
            });
            return;
        }
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "", (err, decode) => {
            if (err) {
                res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                    message: "Invalid or expired token"
                });
                return;
            }
            const payload = decode;
            req.userAuth = payload.id;
            next();
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
            error: error.message,
        });
    }
};
exports.authenticateUser = authenticateUser;
