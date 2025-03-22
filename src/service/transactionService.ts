import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { CustomError } from "../exceptions/error/customError.error";
import { StatusCodes } from "http-status-codes";

dotenv.config();

const EPINS_BASE_URL = process.env.EPINS_BASE_URL;
const EPINS_API_KEY = process.env.EPINS_API_KEY;

const epinsApi = axios.create({
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
export const buyAirtime = async (network: string, phone: number, amount: number, ref: string) => {
  const urlParams = `network=${network}&phone=${phone}&amount=${amount}&ref=${ref}`
  try {
    const response = await epinsApi.get(`/airtime?${urlParams}`);
    console.log(response.data);
    const result: { code: number; description: { response_description: string; } } = response.data;
    if (result.code !== 101) throw new CustomError(StatusCodes.BAD_REQUEST, result.description.response_description);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.description?.response_description || "Transaction failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

/**
 * Buy Data
 */
export const buyData = async (service: string, MobileNumber: string, DataPlan: string, ref: string) => {
  try {
    const response = await epinsApi.post("/data", {
      apiKey: EPINS_API_KEY,
      service,
      MobileNumber,
      DataPlan,
      ref,
    });
    console.log(response.data)
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.description?.response_description || "Transaction failed");
      }
      throw new Error("An unexpected error occurred");
  }
};

/**
 * Validate Meter Number
 */
export const validateMeterNumber = async (service: string, smartNo: string, type: string) => {
  try {
    const response = await epinsApi.post("/merchant-verify", {
      apiKey: EPINS_API_KEY,
      service,
      smartNo,
      type,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.description?.response_description || "Transaction failed");
      }
      throw new Error("An unexpected error occurred");
  }
};

/**
 * Generate Electricity Token
 */
export const generateElectricityToken = async (service: string, accountno: string, vcode: string, amount: number, ref: string) => {
  try {
    const response = await epinsApi.post("/biller", {
      apiKey: EPINS_API_KEY,
      service,
      accountno,
      vcode,
      amount,
      ref,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.description?.response_description || "Transaction failed");
      }
      throw new Error("An unexpected error occurred");
  }
};

/**
 * Validate Betting Account Number
 */
export const validateBettingAccount = async (service: string, customerId: string) => {
  try {
    const response = await epinsApi.post("/bet-verify", {
      apiKey: EPINS_API_KEY,
      service,
      customerId,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.description?.response_description || "Transaction failed");
      }
      throw new Error("An unexpected error occurred");
  }
};

/**
 * Fund Betting Account
 */
export const fundBettingAccount = async (service: string, customerId: string, reference: string, amount: number, customerName: string, request_id: string) => {
  try {
    const response = await epinsApi.post("/betting", {
      apiKey: EPINS_API_KEY,
      service,
      customerId,
      reference,
      amount,
      customerName,
      request_id,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.description?.response_description || "Transaction failed");
      }
      throw new Error("An unexpected error occurred");
  }
};