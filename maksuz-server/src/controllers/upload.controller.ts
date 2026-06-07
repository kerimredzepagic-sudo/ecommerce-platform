import { Request, Response } from 'express';
import { uploadService } from '../services/upload.service';
import { sendSuccess, sendError, sendCreated } from '../utils/apiResponse';
import sharp from 'sharp';

// Image optimization settings
const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 1200;
const IMAGE_QUALITY = 85;

/**
 * Optimize image buffer using Sharp
 */
async function optimizeImage(
  buffer: Buffer,
  mimetype: string
): Promise<{ buffer: Buffer; mimetype: string }> {
  // Only optimize images
  if (!mimetype.startsWith('image/')) {
    return { buffer, mimetype };
  }

  try {
    let sharpInstance = sharp(buffer);

    // Get metadata
    const metadata = await sharpInstance.metadata();

    // Resize if larger than max dimensions
    if (
      (metadata.width && metadata.width > MAX_IMAGE_WIDTH) ||
      (metadata.height && metadata.height > MAX_IMAGE_HEIGHT)
    ) {
      sharpInstance = sharpInstance.resize(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to webp for better compression (optional, keep original format for now)
    let optimizedBuffer: Buffer;
    const outputMimetype = mimetype;

    switch (mimetype) {
      case 'image/jpeg':
      case 'image/jpg':
        optimizedBuffer = await sharpInstance.jpeg({ quality: IMAGE_QUALITY }).toBuffer();
        break;
      case 'image/png':
        optimizedBuffer = await sharpInstance.png({ quality: IMAGE_QUALITY }).toBuffer();
        break;
      case 'image/webp':
        optimizedBuffer = await sharpInstance.webp({ quality: IMAGE_QUALITY }).toBuffer();
        break;
      default:
        // For other formats, just resize without re-encoding
        optimizedBuffer = await sharpInstance.toBuffer();
    }

    return { buffer: optimizedBuffer, mimetype: outputMimetype };
  } catch (error) {
    // If optimization fails, return original
    console.error('Image optimization failed:', error);
    return { buffer, mimetype };
  }
}

/**
 * Upload a single image
 * POST /api/upload/image
 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendError(res, 'Nema fajla za upload', 400);
    }

    const { folder = 'products' } = req.body;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return sendError(res, 'Dozvoljeni formati: JPEG, PNG, WebP, GIF', 400);
    }

    // Optimize image
    const { buffer, mimetype } = await optimizeImage(req.file.buffer, req.file.mimetype);

    // Upload to GCS
    const result = await uploadService.uploadFile(buffer, req.file.originalname, {
      folder,
      contentType: mimetype,
      isPublic: true,
    });

    return sendCreated(res, result, 'Slika uspješno uploadovana');
  } catch (error: any) {
    console.error('Upload error:', error);
    return sendError(res, 'Greška pri uploadu slike: ' + error.message, 500);
  }
};

/**
 * Upload multiple images
 * POST /api/upload/images
 */
export const uploadImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return sendError(res, 'Nema fajlova za upload', 400);
    }

    if (files.length > 10) {
      return sendError(res, 'Maksimalno 10 slika odjednom', 400);
    }

    const { folder = 'products' } = req.body;

    // Validate and optimize all files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const optimizedFiles: Array<{ buffer: Buffer; originalName: string; mimetype: string }> = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return sendError(res, `Nedozvoljeni format: ${file.originalname}`, 400);
      }

      const { buffer, mimetype } = await optimizeImage(file.buffer, file.mimetype);
      optimizedFiles.push({
        buffer,
        originalName: file.originalname,
        mimetype,
      });
    }

    // Upload all files
    const results = await uploadService.uploadFiles(optimizedFiles, folder);

    return sendCreated(res, results, `${results.length} slika uspješno uploadovano`);
  } catch (error: any) {
    console.error('Upload error:', error);
    return sendError(res, 'Greška pri uploadu slika: ' + error.message, 500);
  }
};

/**
 * Delete an image
 * DELETE /api/upload/image
 */
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return sendError(res, 'URL slike je obavezan', 400);
    }

    const deleted = await uploadService.deleteFile(url);

    if (!deleted) {
      return sendError(res, 'Slika nije pronađena', 404);
    }

    return sendSuccess(res, { deleted: true }, 'Slika uspješno obrisana');
  } catch (error: any) {
    console.error('Delete error:', error);
    return sendError(res, 'Greška pri brisanju slike: ' + error.message, 500);
  }
};

/**
 * Delete multiple images
 * DELETE /api/upload/images
 */
export const deleteImages = async (req: Request, res: Response) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return sendError(res, 'Lista URL-ova je obavezna', 400);
    }

    const result = await uploadService.deleteFiles(urls);

    return sendSuccess(res, result, `Obrisano ${result.deleted} slika`);
  } catch (error: any) {
    console.error('Delete error:', error);
    return sendError(res, 'Greška pri brisanju slika: ' + error.message, 500);
  }
};

/**
 * Get signed URL for a file
 * POST /api/upload/signed-url
 */
export const getSignedUrl = async (req: Request, res: Response) => {
  try {
    const { filePath, expiresInMinutes = 60 } = req.body;

    if (!filePath) {
      return sendError(res, 'Putanja fajla je obavezna', 400);
    }

    const signedUrl = await uploadService.getSignedUrl(filePath, expiresInMinutes);

    return sendSuccess(res, { signedUrl }, 'Signed URL generisan');
  } catch (error: any) {
    console.error('Signed URL error:', error);
    return sendError(res, 'Greška pri generisanju URL-a: ' + error.message, 500);
  }
};
