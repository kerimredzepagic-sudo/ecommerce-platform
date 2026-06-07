import { Router, RequestHandler } from "express";
import multer from "multer";
import {
  uploadImage,
  uploadImages,
  deleteImage,
  deleteImages,
  getSignedUrl,
} from "../controllers/upload.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 10, // Max 10 files at once
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Dozvoljeni formati: JPEG, PNG, WebP, GIF"));
    }
  },
});

// All upload routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

/**
 * @route   POST /api/upload/image
 * @desc    Upload a single image
 * @access  Admin
 */
router.post(
  "/image",
  upload.single("image") as unknown as RequestHandler,
  uploadImage
);

/**
 * @route   POST /api/upload/images
 * @desc    Upload multiple images (max 10)
 * @access  Admin
 */
router.post(
  "/images",
  upload.array("images", 10) as unknown as RequestHandler,
  uploadImages
);

/**
 * @route   DELETE /api/upload/image
 * @desc    Delete a single image by URL
 * @access  Admin
 */
router.delete("/image", deleteImage);

/**
 * @route   DELETE /api/upload/images
 * @desc    Delete multiple images by URLs
 * @access  Admin
 */
router.delete("/images", deleteImages);

/**
 * @route   POST /api/upload/signed-url
 * @desc    Get a signed URL for temporary access
 * @access  Admin
 */
router.post("/signed-url", getSignedUrl);

export default router;
