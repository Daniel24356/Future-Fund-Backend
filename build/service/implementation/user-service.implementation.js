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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServiceImpl = void 0;
const customError_error_1 = require("../../exceptions/error/customError.error");
const db_1 = require("../../configs/db");
const password_utils_1 = require("../../utils/password.utils");
const http_status_codes_1 = require("http-status-codes");
const changeSucces_1 = __importDefault(require("../../Design/changeSucces"));
class UserServiceImpl {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield db_1.db.user.findFirst({
                where: { email: data.email },
            });
            if (isUserExist) {
                throw new customError_error_1.CustomError(409, "Oops, email already taken");
            }
            const user = yield db_1.db.user.create({
                data: {
                    email: data.email,
                    password: yield (0, password_utils_1.hostPassword)(data.password),
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role,
                    phoneNumber: data.phoneNumber || null,
                    profilePicture: data.profilePicture || null,
                    balance: 0.0, // Default balance
                },
            });
            if (!user.phoneNumber) {
                throw new customError_error_1.CustomError(400, "Phone number is required for OTP verification");
            }
            //     const otpConfig = await db.otpConfig.findFirst();
            //     if (!otpConfig) {
            //         throw new CustomError(500, "No Infobip Application ID found in the database");
            //     }
            //     const applicationId = otpConfig.applicationId;
            //     const messageId = otpConfig.messageId
            //   const infobipService = new InfobipService();
            //     // Request OTP from Infobip
            //     const otpResponse =  await infobipService.sendPasscode(applicationId, messageId, user.phoneNumber);
            //     if ( !otpResponse.pinId) {
            //         throw new CustomError(500, "Failed to generate OTP");
            //     }
            //     const pinId = otpResponse.pinId;
            //     // Store Infobip OTP request details
            //     await db.otpRequest.create({
            //         data: {
            //             userId: user.id,
            //             pinId: pinId,
            //             messageId: messageId, // Store Infobip message ID
            //             applicationId: applicationId, // Store Infobip app ID
            //             otp: null, // Infobip does not send OTP, so we store null
            //             status: "PENDING",
            //             expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 mins
            //         },
            //     });
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findUnique({
                where: { id },
            });
            if (!user) {
                throw new customError_error_1.CustomError(404, `User with ID ${id} does not exist`);
            }
            return user;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.user.findMany();
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield db_1.db.user.findFirst({ where: { id } });
            if (!isUserExist) {
                throw new customError_error_1.CustomError(404, `No user found with ID ${id}`);
            }
            const user = yield db_1.db.user.update({
                where: { id },
                data,
            });
            return user;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.user.delete({ where: { id } });
        });
    }
    profile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findFirst({ where: { id } });
            if (!user) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, `User with ID ${id} not found`);
            }
            const { password } = user, userData = __rest(user, ["password"]);
            return userData;
        });
    }
    updateProfilePic(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || typeof id !== "string") {
                throw new Error("Invalid ID provided.");
            }
            console.log("Received ID for update:", id);
            const user = yield db_1.db.user.findUnique({
                where: { id },
            });
            if (!user) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
            }
            const updatedUser = yield db_1.db.user.update({
                where: { id },
                data: { profilePicture: data.profilePicture },
            });
            console.log("Updated User:", updatedUser);
            return {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                balance: updatedUser.balance,
                role: updatedUser.role,
                phoneNumber: updatedUser.phoneNumber,
                profilePicture: updatedUser.profilePicture,
                otp: updatedUser.otp,
                otpExpiresAt: updatedUser.otpExpiresAt,
                emailVerified: updatedUser.emailVerified,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
                creditScore: user.creditScore,
            };
        });
    }
    updateBalance(id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findUnique({ where: { id } });
            if (!user) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
            }
            const updatedUser = yield db_1.db.user.update({
                where: { id },
                data: { balance: user.balance + amount },
            });
            return updatedUser;
        });
    }
    setPassword(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                const user = yield transaction.user.findUnique({ where: { id } });
                if (!user) {
                    throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
                }
                const isPasswordValid = yield (0, password_utils_1.comparePassword)(data.oldPassword, user.password || "");
                if (!isPasswordValid) {
                    throw new customError_error_1.CustomError(400, "Current password is incorrect");
                }
                const previousPasswords = yield transaction.passwordHistory.findMany({
                    where: { userId: id },
                    select: { passwordHash: true },
                });
                for (const history of previousPasswords) {
                    const isPreviouslyUsed = yield (0, password_utils_1.comparePassword)(data.newPassword, history.passwordHash);
                    if (isPreviouslyUsed) {
                        throw new customError_error_1.CustomError(400, "The new password has been used before. Please choose a different password");
                    }
                }
                if (user.password) {
                    yield transaction.passwordHistory.create({
                        data: { userId: user.id, passwordHash: user.password },
                    });
                }
                const hashedPassword = yield (0, password_utils_1.hostPassword)(data.newPassword);
                yield transaction.user.update({ where: { id }, data: { password: hashedPassword } });
                const passwordHistoryCount = yield transaction.passwordHistory.count({ where: { userId: id } });
                if (passwordHistoryCount > 5) {
                    const oldestPassword = yield transaction.passwordHistory.findFirst({
                        where: { userId: id },
                        orderBy: { createdAt: "asc" },
                    });
                    if (oldestPassword) {
                        yield transaction.passwordHistory.delete({ where: { id: oldestPassword.id } });
                    }
                }
                yield (0, changeSucces_1.default)({
                    to: user.email,
                    subject: "Password Change Notification",
                    name: user.firstName + " " + user.lastName,
                });
            }));
        });
    }
}
exports.UserServiceImpl = UserServiceImpl;
