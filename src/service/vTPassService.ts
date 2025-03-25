import axios from "axios";
import dotenv from "dotenv";
import { generateRequestId } from "../utils/generateRequestId";

dotenv.config();

const VTPASS_BASE_URL = process.env.VTPASS_BASE_URL!;
const API_KEY = process.env.VTPASS_API_KEY!;
const SECRET_KEY = process.env.VTPASS_SECRET_KEY!;


const vtpassRequest = async (endpoint: string, data: object) => {
  try {
    console.log(API_KEY)
    console.log(SECRET_KEY)
    const response = await axios.post(`${VTPASS_BASE_URL}/${endpoint}`, data, {
      headers: {
        "api-key": API_KEY,
        "secret-key": SECRET_KEY,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("VTpass API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.response_description || "VTpass API error");
  }
};

/**
 * Buy Airtime
 */
export const buyAirtime = async (network: string, phone: number, amount: number) => {
  return vtpassRequest("pay", {
    serviceID: network, // Example: "mtn", "airtel", "glo", "9mobile"
    phone,
    amount,
    request_id: generateRequestId("airtime"), // Unique transaction ID
  });
};

/**
 * Buy Data
 */
export const buyData = async (network: string, phone: number, billersCode: string, variation_code: string, amount: number) => {
  return vtpassRequest("pay", {
    serviceID: network, // Example: "mtn-data", "airtel-data", "glo-data", "9mobile-data"
    phone,
    billersCode,
    amount,
    variation_code, // Plan code from VTpass documentation
    request_id: generateRequestId("data"),
  });
};

export const verifyMeter = async (meterNumber: number, disco: string, type:string ) => {
    return vtpassRequest("merchant-verify", {
      serviceID: disco, // Example: "ikeja-electric", "eko-electric"
      billersCode: meterNumber, // Meter number
      type: type, // "prepaid" or "postpaid"
    });
  };

/**
 * Pay Electricity Bill
 */
export const payElectricity = async (disco: string, meterNumber: string, amount: number, type: string, phone: number) => {
  return vtpassRequest("pay", {
    serviceID: disco, // Example: "ikeja-electric", "eko-electric"
    billersCode: meterNumber, // Meter number
    amount,
    phone,
    variation_code: type, // "prepaid" or "postpaid"
    request_id: generateRequestId("electricity"),
  });
};

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
