"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only PDF and image files are allowed"));
    }
};
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
const uploadSingle = (req, res, next) => {
    upload.single("accountStatement")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message || "File upload failed" });
        }
        if (!req.file) {
            return res.status(400).json({ error: "File upload is required" });
        }
        next();
    });
};
exports.uploadSingle = uploadSingle;
