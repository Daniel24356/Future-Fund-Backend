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
const axios_1 = __importDefault(require("axios"));
const sendPushNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    const notificationData = {
        app_id: "5ac84d9d-2f6c-4656-adc6-3543ccaa0bd1",
        included_segments: ["All"],
        headings: { en: "Daily Reminder 📢" },
        contents: { en: "Don't forget to transfer today! 🚀" },
    };
    try {
        const response = yield axios_1.default.post("https://onesignal.com/api/v1/notifications", notificationData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Key os_v2_app_llee3hjpnrdfnloggvb4zkql2gfbiffdbkyeas5xthquvicrhubquq5xhd7omiv7urdfi2lof25p7wxgy6prhje4zamjtivhmbmok4i",
            },
        });
        console.log("Push Notification Sent Successfully!", response.data);
    }
    catch (error) {
        console.error("Error sending notification:", error.response.data);
    }
});
exports.default = sendPushNotification;
