import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed"));
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadSingle = (req: Request, res: Response, next: NextFunction) => {
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