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
exports.uploadToCloudinaryProfileImage = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure Cloudinary Storage for Profile Images
const profileImageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const timestamp = Date.now();
        const fileName = file.originalname.split(".")[0];
        return {
            folder: "E-learning", // Cloudinary folder for profile images
            public_id: `${fileName}-${timestamp}`,
            resource_type: "image", // Enforce image type uploads
        };
    }),
});
// Multer Configuration for Profile Image Uploads
const uploadProfileImage = (0, multer_1.default)({
    storage: profileImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = /image\/(jpeg|png|jpg)/;
        if (!allowedImageTypes.test(file.mimetype)) {
            // Cast cb to the correct type
            cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
        }
        else {
            cb(null, true);
        }
    },
});
// Export the Multer Middleware
exports.uploadToCloudinaryProfileImage = uploadProfileImage.single("profileImage"); // Allow only one image at a time
