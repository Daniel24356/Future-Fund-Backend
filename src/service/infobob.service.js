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
const follow_redirects_1 = require("follow-redirects");
const customError_error_1 = require("../exceptions/error/customError.error");
class InfobipService {
    constructor() {
        this.sendPasscode = (applicationId, // Application ID from 2FA
        messageId, // Message template ID
        phoneNumber // Recipient's phone number
        ) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const options = {
                    method: 'POST',
                    hostname: 'api.infobip.com',
                    path: '/2fa/2/pin',
                    headers: {
                        'Authorization': `App ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    maxRedirects: 20,
                };
                const postData = JSON.stringify({
                    applicationId, // Use the actual applicationId
                    messageId, // Use the actual messageId
                    from: '447491163443', // This is your sender's phone number (replace with your own)
                    to: phoneNumber, // Recipient's phone number
                });
                const req = follow_redirects_1.https.request(options, (res) => {
                    let chunks = [];
                    res.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    res.on('end', () => {
                        const body = Buffer.concat(chunks);
                        const response = body.toString();
                        // Handle success
                        if (res.statusCode === 200 || res.statusCode === 201) {
                            console.log('OTP delivered successfully:', response);
                            resolve();
                        }
                        else {
                            console.error('Error sending OTP:', response);
                            reject(new customError_error_1.CustomError(500, `Failed to send OTP. Response: ${response}`));
                        }
                    });
                    res.on('error', (error) => {
                        console.error('Request failed:', error);
                        reject(new customError_error_1.CustomError(500, `Request failed. Error: ${error.message}`));
                    });
                });
                req.write(postData);
                req.end();
            });
        });
        this.verifyPin = (pinId, // Pin ID received after sending OTP
        pinCode // The OTP entered by the user for verification
        ) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const options = {
                    method: 'POST',
                    hostname: 'api.infobip.com',
                    path: `/2fa/2/pin/${pinId}/verify`, // Use the pinId in the URL path
                    headers: {
                        'Authorization': `App ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    maxRedirects: 20,
                };
                // The postData with pin entered by the user
                const postData = JSON.stringify({
                    pin: pinCode, // The actual pin code entered by the user
                });
                const req = follow_redirects_1.https.request(options, (res) => {
                    let chunks = [];
                    res.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    res.on('end', () => {
                        const body = Buffer.concat(chunks);
                        const response = body.toString();
                        // Handle success
                        if (res.statusCode === 200 || res.statusCode === 201) {
                            console.log('OTP verified successfully:', response);
                            resolve();
                        }
                        else {
                            console.error('Error verifying OTP:', response);
                            reject(new customError_error_1.CustomError(500, `Failed to verify OTP. Response: ${response}`));
                        }
                    });
                    res.on('error', (error) => {
                        console.error('Request failed:', error);
                        reject(new customError_error_1.CustomError(500, `Request failed. Error: ${error.message}`));
                    });
                });
                req.write(postData);
                req.end();
            });
        });
        this.apiKey = process.env.INFOBIP_API_KEY || '';
        this.baseUrl = process.env.INFOBIP_BASE_URL || 'https://jj6829.api.infobip.com'; // Default to Infobip base URL
    }
    create2FAApplication() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apiKey) {
                throw new Error('Infobip API key is not configured');
            }
            const options = {
                method: 'POST',
                hostname: new URL(this.baseUrl).hostname,
                path: '/2fa/2/applications',
                headers: {
                    Authorization: `App ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                maxRedirects: 20,
            };
            const postData = JSON.stringify({
                name: '2fa test application',
                enabled: true,
                configuration: {
                    pinAttempts: 10,
                    allowMultiplePinVerifications: true,
                    pinTimeToLive: '15m',
                    verifyPinLimit: '1/3s',
                    sendPinPerApplicationLimit: '100/1d',
                    sendPinPerPhoneNumberLimit: '10/1d',
                },
            });
            return new Promise((resolve, reject) => {
                const req = follow_redirects_1.https.request(options, (res) => {
                    const chunks = [];
                    res.on('data', (chunk) => chunks.push(chunk));
                    res.on('end', () => {
                        const body = Buffer.concat(chunks).toString();
                        console.log('Response Body:', body);
                        try {
                            const response = JSON.parse(body);
                            if (res.statusCode === 201 && response.applicationId) {
                                console.log('2FA Application created successfully:', response);
                                resolve(response.applicationId); // Return applicationId
                            }
                            else {
                                console.error('Failed to create 2FA application:', {
                                    statusCode: res.statusCode,
                                    response,
                                });
                                reject(new Error(`Failed to create 2FA application. Status: ${res.statusCode}, Response: ${body}`));
                            }
                        }
                        catch (error) {
                            console.error('Error parsing response:', error);
                            reject(new Error('Failed to parse Infobip API response'));
                        }
                    });
                    res.on('error', (error) => {
                        console.error('Error during request:', error);
                        reject(new Error(`Error during HTTPS request: ${JSON.stringify(error)}`));
                    });
                });
                req.on('error', (error) => {
                    console.error('Request error:', error);
                    reject(new Error(`Failed to send request: ${error.message}`));
                });
                req.write(postData);
                req.end();
            });
        });
    }
    createMessageTemplate(appId, templateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apiKey) {
                throw new Error('Infobip API key is not configured');
            }
            const options = {
                method: 'POST',
                hostname: new URL(this.baseUrl).hostname,
                path: `/2fa/2/applications/${appId}/messages`,
                headers: {
                    Authorization: `App ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                maxRedirects: 20,
            };
            const postData = JSON.stringify({
                pinType: templateData.pinType,
                messageText: templateData.messageText,
                pinLength: templateData.pinLength,
                senderId: templateData.senderId,
            });
            return new Promise((resolve, reject) => {
                const req = follow_redirects_1.https.request(options, (res) => {
                    const chunks = [];
                    res.on('data', (chunk) => chunks.push(chunk));
                    res.on('end', () => {
                        const body = Buffer.concat(chunks).toString();
                        console.log('Response Body:', body);
                        const response = JSON.parse(body);
                        if (res.statusCode === 201) {
                            console.log('Message template created successfully:', response);
                            resolve();
                        }
                        else {
                            console.error('Failed to create message template:', {
                                statusCode: res.statusCode,
                                response: response,
                            });
                            reject(new Error(`Failed to create message template. Status: ${res.statusCode}, Response: ${body}`));
                        }
                    });
                    res.on('error', (error) => {
                        console.error('Error during request:', error);
                        reject(new Error(`Error during HTTPS request: ${JSON.stringify(error)}`));
                    });
                });
                req.write(postData);
                req.end();
            });
        });
    }
}
exports.default = InfobipService;
