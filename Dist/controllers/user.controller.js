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
exports.UserController = void 0;
const user_service_implementation_1 = require("../service/implementation/user-service.implementation");
const http_status_codes_1 = require("http-status-codes");
class UserController {
    constructor() {
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const newUser = yield this.userService.createUser(userData);
                res.status(201).json(newUser);
            }
            catch (error) {
                next(error);
            }
        });
        this.getUserById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (req.params.id);
                const user = yield this.userService.getUserById(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getAllUsers();
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (req.params.id);
                const userData = req.body;
                const updateUser = yield this.userService.updateUser(userId, userData);
                res.status(200).json(updateUser);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (req.params.id);
                const deleteUser = yield this.userService.deleteUser(userId);
                res.status(200).json(deleteUser);
            }
            catch (error) {
                next(error);
            }
        });
        this.profile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = (_a = req.userAuth) !== null && _a !== void 0 ? _a : "";
                const user = yield this.userService.getUserById(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    error: false,
                    message: "User profile retrieved successfully",
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.updateProfilePic = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userAuth;
                console.log("Decoded User ID:", req.userAuth);
                if (!userId) {
                    res.status(401).json({
                        error: true,
                        message: "Unauthorized. User ID missing in token.",
                    });
                    return;
                }
                if (!req.file || !req.file.path) {
                    res.status(400).json({
                        error: true,
                        message: "No profile image uploaded",
                    });
                    return;
                }
                console.log("Uploaded file details:", req.file);
                const profilePicUrl = req.file.path; // Cloudinary URL after upload
                yield this.userService.updateProfilePic(userId, {
                    profilePicture: profilePicUrl,
                });
                res.status(200).json({
                    error: false,
                    message: "Profile picture updated successfully",
                    data: { profilePic: profilePicUrl },
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.setPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = (_a = req.userAuth) !== null && _a !== void 0 ? _a : "";
                const data = req.body;
                yield this.userService.setPassword(id, data);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    error: false,
                    message: "Password changed successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.userService = new user_service_implementation_1.UserServiceImpl();
    }
}
exports.UserController = UserController;
