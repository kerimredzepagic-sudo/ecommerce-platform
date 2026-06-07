import { Storage, Bucket } from '@google-cloud/storage';
import { env } from '../config/env';
import path from 'path';
import crypto from 'crypto';

interface UploadOptions {
  folder?: string;
  fileName?: string;
  contentType?: string;
  isPublic?: boolean;
}

interface UploadResult {
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  contentType: string;
  bucket: string;
  folder: string;
}

class UploadService {
  private storage: Storage;
  private bucket: Bucket;
  private bucketName: string;

  constructor() {
    this.bucketName = env.GCS_BUCKET_NAME || 'maksuz';

    // Initialize storage with credentials
    if (env.GCS_CREDENTIALS_BASE64) {
      // Production: decode from base64
      const credentials = JSON.parse(
        Buffer.from(env.GCS_CREDENTIALS_BASE64, 'base64').toString('utf8')
      );
      this.storage = new Storage({
        projectId: env.GCS_PROJECT_ID,
        credentials,
      });
    } else if (env.GCS_KEY_FILE) {
      // Local: use JSON file
      this.storage = new Storage({
        projectId: env.GCS_PROJECT_ID,
        keyFilename: env.GCS_KEY_FILE,
      });
    } else {
      throw new Error('GCS credentials not configured (GCS_CREDENTIALS_BASE64 or GCS_KEY_FILE required)');
    }

    this.bucket = this.storage.bucket(this.bucketName);
  }

  /**
   * Generate a unique filename with original extension
   */
  private generateFileName(originalName: string): string {
    const ext = path.extname(originalName).toLowerCase();
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${timestamp}-${random}${ext}`;
  }

  /**
   * Upload a file buffer to GCS
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const { folder = 'uploads', contentType = 'application/octet-stream' } = options;
    
    const fileName = options.fileName || this.generateFileName(originalName);
    const filePath = `${folder}/${fileName}`;
    
    const file = this.bucket.file(filePath);

    await file.save(buffer, {
      contentType,
      metadata: {
        cacheControl: 'public, max-age=31536000',
        originalName,
      },
    });

    // Try to make public if requested
    if (options.isPublic) {
      try {
        await file.makePublic();
      } catch (error) {
        // Bucket may not allow public access - continue with signed URLs
        console.log('Could not make file public, will use signed URLs');
      }
    }

    return {
      url: await this.getPublicUrl(filePath),
      fileName,
      originalName,
      size: buffer.length,
      contentType,
      bucket: this.bucketName,
      folder,
    };
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: Array<{ buffer: Buffer; originalName: string; mimetype: string }>,
    folder: string = 'products'
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file.buffer, file.originalName, {
        folder,
        contentType: file.mimetype,
        isPublic: true,
      })
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from GCS
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      // If full URL provided, extract the file path
      const path = filePath.includes('storage.googleapis.com')
        ? filePath.split(`${this.bucketName}/`)[1]
        : filePath;

      await this.bucket.file(path).delete();
      return true;
    } catch (error: any) {
      if (error.code === 404) {
        return false; // File already doesn't exist
      }
      throw error;
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(filePaths: string[]): Promise<{ deleted: number; failed: number }> {
    let deleted = 0;
    let failed = 0;

    for (const filePath of filePaths) {
      try {
        const success = await this.deleteFile(filePath);
        if (success) deleted++;
        else failed++;
      } catch {
        failed++;
      }
    }

    return { deleted, failed };
  }

  /**
   * Get public URL for a file
   * Uses direct public URL for public buckets
   */
  async getPublicUrl(filePath: string): Promise<string> {
    // Direct public URL - bucket must have public access enabled
    return `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
  }

  /**
   * Generate a signed URL for temporary access
   */
  async getSignedUrl(filePath: string, expiresInMinutes: number = 60): Promise<string> {
    const file = this.bucket.file(filePath);
    
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });

    return signedUrl;
  }

  /**
   * Check if a file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const [exists] = await this.bucket.file(filePath).exists();
      return exists;
    } catch {
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(filePath: string): Promise<object | null> {
    try {
      const [metadata] = await this.bucket.file(filePath).getMetadata();
      return metadata;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService();

