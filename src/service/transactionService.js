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
exports.fundBettingAccount = exports.validateBettingAccount = exports.generateElectricityToken = exports.validateMeterNumber = exports.buyData = exports.buyAirtime = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const EPINS_BASE_URL = process.env.EPINS_BASE_URL;
const EPINS_API_KEY = process.env.EPINS_API_KEY;
const epinsApi = axios_1.default.create({
    baseURL: EPINS_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
    },
});
/**
 * Buy Airtime
 */
const buyAirtime = (network, phone, amount, ref) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const response = yield epinsApi.post("/airtime", {
            apiKey: EPINS_API_KEY,
            network,
            phone,
            amount,
            ref,
        });
        console.log({ apiKey: EPINS_API_KEY,
            network,
            phone,
            amount,
            ref, });
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.description) === null || _c === void 0 ? void 0 : _c.response_description) || "Transaction failed");
        }
        throw new Error("An unexpected error occurred");
    }
});
exports.buyAirtime = buyAirtime;
/**
 * Buy Data
 */
const buyData = (service, MobileNumber, DataPlan, ref) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const response = yield epinsApi.post("/data", {
            apiKey: EPINS_API_KEY,
            service,
            MobileNumber,
            DataPlan,
            ref,
        });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.description) === null || _c === void 0 ? void 0 : _c.response_description) || "Transaction failed");
        }
        throw new Error("An unexpected error occurred");
    }
});
exports.buyData = buyData;
/**
 * Validate Meter Number
 */
const validateMeterNumber = (service, smartNo, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const response = yield epinsApi.post("/merchant-verify", {
            apiKey: EPINS_API_KEY,
            service,
            smartNo,
            type,
        });
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.description) === null || _c === void 0 ? void 0 : _c.response_description) || "Transaction failed");
        }
        throw new Error("An unexpected error occurred");
    }
});
exports.validateMeterNumber = validateMeterNumber;
/**
 * Generate Electricity Token
 */
const generateElectricityToken = (service, accountno, vcode, amount, ref) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const response = yield epinsApi.post("/biller", {
            apiKey: EPINS_API_KEY,
            service,
            accountno,
            vcode,
            amount,
            ref,
        });
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.description) === null || _c === void 0 ? void 0 : _c.response_description) || "Transaction failed");
        }
        throw new Error("An unexpected error occurred");
    }
});
exports.generateElectricityToken = generateElectricityToken;
/**
 * Validate Betting Account Number
 */
const validateBettingAccount = (service, customerId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const response = yield epinsApi.post("/bet-verify", {
            apiKey: EPINS_API_KEY,
            service,
            customerId,
        });
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.description) === null || _c === void 0 ? void 0 : _c.response_description) || "Transaction failed");
        }
        throw new Error("An unexpected error occurred");
    }
});
exports.validateBettingAccount = validateBettingAccount;
/**
 * Fund Betting Account
 */
const fundBettingAccount = (service, customerId, reference, amount, customerName, request_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const response = yield epinsApi.post("/betting", {
            apiKey: EPINS_API_KEY,
            service,
            customerId,
            reference,
            amount,
            customerName,
            request_id,
        });
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.description) === null || _c === void 0 ? void 0 : _c.response_description) || "Transaction failed");
        }
        throw new Error("An unexpected error occurred");
    }
});
exports.fundBettingAccount = fundBettingAccount;
