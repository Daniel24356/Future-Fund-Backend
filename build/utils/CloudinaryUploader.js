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
exports.uploadToCloudinaryProfileImage = exports.uploadFileToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const profileImageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const timestamp = Date.now();
        const fileName = file.originalname.split(".")[0];
        return {
            folder: "E-learning",
            public_id: `${fileName}-${timestamp}`,
            resource_type: "image",
        };
    }),
});
const uploadProfileImage = (0, multer_1.default)({
    storage: profileImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = /image\/(jpeg|png|jpg)/;
        if (!allowedImageTypes.test(file.mimetype)) {
            return cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
        }
        cb(null, true);
    },
});
const uploadFileToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: "auto" }, (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error);
                return reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }
            if (!(result === null || result === void 0 ? void 0 : result.secure_url)) {
                console.error("Cloudinary Response Error:", result);
                return reject(new Error("Cloudinary upload failed: secure_url is missing"));
            }
            resolve({ secure_url: result.secure_url });
        });
        if (!buffer) {
            return reject(new Error("Invalid file buffer"));
        }
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
};
exports.uploadFileToCloudinary = uploadFileToCloudinary;
exports.uploadToCloudinaryProfileImage = uploadProfileImage.single("profileImage");
