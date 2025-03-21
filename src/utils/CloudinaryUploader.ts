import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";
import streamifier from "streamifier";

dotenv.config(); 


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResponse {
  secure_url: string;
  public_id: string;
}


const profileImageStorage = new CloudinaryStorage({
  cloudinary, 
  params: async (req: Request, file: Express.Multer.File) => {
    const timestamp = Date.now();
    const fileName = file.originalname.split(".")[0];

    return {
      folder: "E-learning",
      public_id: `${fileName}-${timestamp}`,
      resource_type: "image",
    };
  },
});


const uploadProfileImage = multer({
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


export const uploadFileToCloudinary = (buffer: Buffer, folder: string): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "auto" }, 
          (error, result) => {
              if (error) {
                  console.error("Cloudinary Upload Error:", error);
                  return reject(new Error(`Cloudinary upload failed: ${error.message}`));
              }

              if (!result?.secure_url) {
                  console.error("Cloudinary Response Error:", result);
                  return reject(new Error("Cloudinary upload failed: secure_url is missing"));
              }

              resolve({ secure_url: result.secure_url });
          }
      );

     
      if (!buffer) {
          return reject(new Error("Invalid file buffer"));
      }

      streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const uploadToCloudinaryProfileImage = uploadProfileImage.single("profileImage");

