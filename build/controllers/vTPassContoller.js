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
exports.VTPASSController = void 0;
const vTPassService_1 = require("../service/vTPassService");
class VTPASSController {
    constructor() {
        /**
         * Airtime Purchase Controller
         */
        this.airtimePurchase = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { network, phone, amount } = req.body;
                const formattedPhone = Number(`0${phone.substring(1)}`);
                const result = yield (0, vTPassService_1.buyAirtime)(network, formattedPhone, amount);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        /**
         * Data Purchase Controller
         */
        this.dataPurchase = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { network, phone, variation_code, billersCode, amount } = req.body;
                const formattedPhone = Number(`0${phone.substring(1)}`);
                const result = yield (0, vTPassService_1.buyData)(network, formattedPhone, billersCode, variation_code, amount);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.verifyMeter = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { disco, meterNumber, type } = req.body;
                const result = yield (0, vTPassService_1.verifyMeter)(meterNumber, disco, type);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        /**
         * Electricity Payment Controller
         */
        this.electricityPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { disco, meterNumber, amount, type, phone } = req.body;
                const formattedPhone = Number(`0${phone.substring(1)}`);
                const result = yield (0, vTPassService_1.payElectricity)(disco, meterNumber, amount, type, formattedPhone);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        /**
         * Betting Wallet Funding Controller
         */
        //   public bettingFunding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        //     try {
        //       const { bettingService, customerID, amount } = req.body;
        //       const result = await fundBettingAccount(bettingService, customerID, amount);
        //       res.status(200).json(result);
        //     } catch (error: any) {
        //       res.status(500).json({ error: error.message });
        //     }
        //   };
    }
}
exports.VTPASSController = VTPASSController;
