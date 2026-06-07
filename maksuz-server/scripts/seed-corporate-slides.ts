/**
 * Seed script to add corporate hero slides to the database
 * 
 * Usage: npx ts-node scripts/seed-corporate-slides.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Slide } from '../src/models/Slide.model';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maksuz';

const corporateSlides = [
  {
    title: "Porodični proizvođači prirodnih delicija koji spajaju tradicionalne vrijednosti sa modernim standardima kvaliteta iz srca BiH.",
    headTitle: "PRAVLJENO IZ LJUBAVI OD 2019.",
    description: "Otkrijte bogatstvo tradicionalnih okusa s Maksuz proizvodima – od pčelinjih proizvoda do prirodnih namaza i začina.",
    backgroundType: "video" as const,
    backgroundUrl: "https://storage.googleapis.com/maksuz-bucket/videos/Api_terapija_MaksuzKutak_720P.mp4",
    buttonPrimaryText: "Naša priča",
    buttonPrimaryLink: "/o-nama",
    buttonSecondaryText: "WEBSHOP",
    buttonSecondaryLink: "/shop",
    order: 0,
    isActive: true,
    location: "corporate" as const,
  },
  {
    title: "Tradicija i kvalitet u svakom zalogaju – od naših pčela do vašeg stola.",
    headTitle: "100% PRIRODNI PROIZVODI",
    description: "Istražite našu bogatu ponudu meda, ajvara, prirodnih namaza i jedinstvenih poklona iz srca Bosne.",
    backgroundType: "image" as const,
    backgroundUrl: "https://storage.googleapis.com/maksuz-bucket/videos/IMG_5170.jpg",
    buttonPrimaryText: "Naši proizvodi",
    buttonPrimaryLink: "/proizvodi",
    buttonSecondaryText: "WEBSHOP",
    buttonSecondaryLink: "/shop",
    order: 1,
    isActive: true,
    location: "corporate" as const,
  },
];

async function seedCorporateSlides() {
  console.log('🚀 Starting corporate slides seeding...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if corporate slides already exist
    const existingSlides = await Slide.find({ location: 'corporate' });
    
    if (existingSlides.length > 0) {
      console.log(`⚠️  Found ${existingSlides.length} existing corporate slide(s).`);
      console.log('   Deleting existing corporate slides...');
      await Slide.deleteMany({ location: 'corporate' });
      console.log('   ✅ Deleted existing corporate slides.\n');
    }

    // Insert new slides
    console.log('📤 Creating corporate slides...\n');
    
    for (const slideData of corporateSlides) {
      const slide = new Slide(slideData);
      await slide.save();
      console.log(`✅ Created slide: "${slideData.headTitle}"`);
      console.log(`   Type: ${slideData.backgroundType}`);
      console.log(`   URL: ${slideData.backgroundUrl}\n`);
    }

    console.log('🎉 Corporate slides seeded successfully!\n');
    console.log('You can now see the slides on the home page (/) and in Admin -> Slajdovi');

  } catch (error) {
    console.error('❌ Error seeding slides:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

seedCorporateSlides();
