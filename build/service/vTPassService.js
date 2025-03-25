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
exports.payElectricity = exports.verifyMeter = exports.buyData = exports.buyAirtime = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const generateRequestId_1 = require("../utils/generateRequestId");
dotenv_1.default.config();
const VTPASS_BASE_URL = process.env.VTPASS_BASE_URL;
const API_KEY = process.env.VTPASS_API_KEY;
const SECRET_KEY = process.env.VTPASS_SECRET_KEY;
const vtpassRequest = (endpoint, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        console.log(API_KEY);
        console.log(SECRET_KEY);
        const response = yield axios_1.default.post(`${VTPASS_BASE_URL}/${endpoint}`, data, {
            headers: {
                "api-key": API_KEY,
                "secret-key": SECRET_KEY,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("VTpass API Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.response_description) || "VTpass API error");
    }
});
/**
 * Buy Airtime
 */
const buyAirtime = (network, phone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    return vtpassRequest("pay", {
        serviceID: network, // Example: "mtn", "airtel", "glo", "9mobile"
        phone,
        amount,
        request_id: (0, generateRequestId_1.generateRequestId)("airtime"), // Unique transaction ID
    });
});
exports.buyAirtime = buyAirtime;
/**
 * Buy Data
 */
const buyData = (network, phone, billersCode, variation_code, amount) => __awaiter(void 0, void 0, void 0, function* () {
    return vtpassRequest("pay", {
        serviceID: network, // Example: "mtn-data", "airtel-data", "glo-data", "9mobile-data"
        phone,
        billersCode,
        amount,
        variation_code, // Plan code from VTpass documentation
        request_id: (0, generateRequestId_1.generateRequestId)("data"),
    });
});
exports.buyData = buyData;
const verifyMeter = (meterNumber, disco, type) => __awaiter(void 0, void 0, void 0, function* () {
    return vtpassRequest("merchant-verify", {
        serviceID: disco, // Example: "ikeja-electric", "eko-electric"
        billersCode: meterNumber, // Meter number
        type: type, // "prepaid" or "postpaid"
    });
});
exports.verifyMeter = verifyMeter;
/**
 * Pay Electricity Bill
 */
const payElectricity = (disco, meterNumber, amount, type, phone) => __awaiter(void 0, void 0, void 0, function* () {
    return vtpassRequest("pay", {
        serviceID: disco, // Example: "ikeja-electric", "eko-electric"
        billersCode: meterNumber, // Meter number
        amount,
        phone,
        variation_code: type, // "prepaid" or "postpaid"
        request_id: (0, generateRequestId_1.generateRequestId)("electricity"),
    });
});
exports.payElectricity = payElectricity;
// /**
//  * Bet Wallet Funding
//  */
// export const fundBettingAccount = async (bettingService: string, customerID: string, amount: number) => {
//   return vtpassRequest("pay", {
//     serviceID: bettingService, // Example: "bet9ja", "sportybet", "msport"
//     billersCode: customerID, // Betting account ID
//     amount,
//     request_id: `betting_${Date.now()}`,
//   });
// };
