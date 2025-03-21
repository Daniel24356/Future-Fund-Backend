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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
exports.welcomeEmail = welcomeEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const render_1 = require("@react-email/render");
const OtpEmail_1 = __importDefault(require("../Design/OtpEmail"));
const react_1 = __importDefault(require("react"));
const Welcome_1 = __importDefault(require("../Design/Welcome"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
function sendOtpEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, subject, otp }) {
        const emailHtml = yield (0, render_1.render)(react_1.default.createElement(OtpEmail_1.default, { otp: otp }));
        yield transporter.sendMail({
            from: `Futurerify <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: emailHtml,
        });
    });
}
function welcomeEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, subject, name }) {
        const emailHtml = yield (0, render_1.render)(react_1.default.createElement(Welcome_1.default, { name: name }));
        yield transporter.sendMail({
            from: `Futurerify <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: emailHtml,
        });
    });
}
