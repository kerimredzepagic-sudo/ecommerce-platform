/**
 * Script to upload slider media files to Google Cloud Storage
 * 
 * Usage: npx ts-node scripts/upload-slider-media.ts
 */

import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'maksuz-bucket';
const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID;
const GCS_KEY_FILE = process.env.GCS_KEY_FILE;
const GCS_CREDENTIALS_BASE64 = process.env.GCS_CREDENTIALS_BASE64;

async function uploadSliderMedia() {
  console.log('🚀 Starting slider media upload...\n');

  // Initialize storage
  let storage: Storage;

  if (GCS_CREDENTIALS_BASE64) {
    const credentials = JSON.parse(
      Buffer.from(GCS_CREDENTIALS_BASE64, 'base64').toString('utf8')
    );
    storage = new Storage({
      projectId: GCS_PROJECT_ID,
      credentials,
    });
  } else if (GCS_KEY_FILE) {
    storage = new Storage({
      projectId: GCS_PROJECT_ID,
      keyFilename: GCS_KEY_FILE,
    });
  } else {
    throw new Error('GCS credentials not configured');
  }

  const bucket = storage.bucket(GCS_BUCKET_NAME);

  // Files to upload (from project root)
  const filesToUpload = [
    {
      localPath: path.join(__dirname, '../../Api_terapija_MaksuzKutak_720P.mp4'),
      gcsPath: 'videos/Api_terapija_MaksuzKutak_720P.mp4',
      contentType: 'video/mp4',
    },
    {
      localPath: path.join(__dirname, '../../IMG_5170.jpg'),
      gcsPath: 'videos/IMG_5170.jpg',
      contentType: 'image/jpeg',
    },
  ];

  for (const file of filesToUpload) {
    try {
      // Check if local file exists
      if (!fs.existsSync(file.localPath)) {
        console.log(`⚠️  File not found: ${file.localPath}`);
        continue;
      }

      console.log(`📤 Uploading: ${path.basename(file.localPath)}`);
      console.log(`   From: ${file.localPath}`);
      console.log(`   To: gs://${GCS_BUCKET_NAME}/${file.gcsPath}`);

      // Upload file
      await bucket.upload(file.localPath, {
        destination: file.gcsPath,
        metadata: {
          contentType: file.contentType,
          cacheControl: 'public, max-age=31536000',
        },
      });

      const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${file.gcsPath}`;
      console.log(`✅ Uploaded successfully!`);
      console.log(`   URL: ${publicUrl}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file.localPath}:`, error);
    }
  }

  console.log('🎉 Upload complete!\n');
  console.log('Use these URLs in the admin panel:');
  console.log(`  Video: https://storage.googleapis.com/${GCS_BUCKET_NAME}/videos/Api_terapija_MaksuzKutak_720P.mp4`);
  console.log(`  Image: https://storage.googleapis.com/${GCS_BUCKET_NAME}/videos/IMG_5170.jpg`);
}

uploadSliderMedia().catch(console.error);
