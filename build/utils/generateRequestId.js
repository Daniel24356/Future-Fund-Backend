"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRequestId = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate VTpass Request ID
 * Format: YYYYMMDDHHmm + random alphanumeric string
 */
const generateRequestId = (prefix) => {
    const lagosTime = (0, moment_timezone_1.default)().tz("Africa/Lagos").format("YYYYMMDDHHmm"); // Get current time in Lagos timezone
    const randomString = crypto_1.default.randomBytes(6).toString("hex"); // Generate a random 12-character string
    return `${lagosTime}_${prefix}_${randomString}`;
};
exports.generateRequestId = generateRequestId;
