import moment from "moment-timezone";
import crypto from "crypto";

/**
 * Generate VTpass Request ID
 * Format: YYYYMMDDHHmm + random alphanumeric string
 */
export const generateRequestId = (prefix: string): string => {
  const lagosTime = moment().tz("Africa/Lagos").format("YYYYMMDDHHmm"); // Get current time in Lagos timezone
  const randomString = crypto.randomBytes(6).toString("hex"); // Generate a random 12-character string
  return `${lagosTime}_${prefix}_${randomString}`;
};
