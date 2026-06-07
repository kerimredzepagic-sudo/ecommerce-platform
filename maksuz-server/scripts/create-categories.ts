/**
 * Create categories from WooCommerce structure
 * Usage: npx ts-node scripts/create-categories.ts
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
import { Category } from '../src/models/Category.model';

config();

// Slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[čć]/g, 'c')
    .replace(/[šś]/g, 's')
    .replace(/[žź]/g, 'z')
    .replace(/đ/g, 'dj')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Category structure from WooCommerce
const CATEGORIES = {
  'API': [],
  'Grickalice': ['Energy balls', 'Orašasti plodovi', 'Sjemenke'],
  'Med': ['Med u zemljanim posudama', 'Medne mješavine', 'Prirodni med', 'Propolis'],
  'Namazi i puteri': ['Džemovi', 'Pekmez', 'Puteri', 'Sos'],
  'Pića': ['100% sokovi', 'Čajevi', 'Kombinacije sa jabukom', 'Sirupi'],
  'Pokloni i paketi': [],
  'Razno': [],
  'Slatki program': ['Čokoladni asortiman', 'Kandirano voće', 'Suho voće'],
  'Ulja i začini': ['Ulja', 'Začini'],
  'Žitarice i pahuljice': [],
};

async function createCategories() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/maksuz';
  
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB\n');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('📁 Creating Categories');
  console.log('═══════════════════════════════════════════════════════════\n');

  let created = 0;
  let skipped = 0;
  let order = 0;

  for (const [mainCategory, subCategories] of Object.entries(CATEGORIES)) {
    const mainSlug = slugify(mainCategory);
    
    // Check if main category exists
    let mainCat = await Category.findOne({ slug: mainSlug });
    
    if (!mainCat) {
      mainCat = await Category.create({
        name: mainCategory,
        slug: mainSlug,
        level: 1,
        ancestors: [],
        isActive: true,
        order: order++,
      });
      console.log(`✓ Created: ${mainCategory}`);
      created++;
    } else {
      console.log(`○ Exists: ${mainCategory}`);
      skipped++;
    }

    // Create subcategories
    let subOrder = 0;
    for (const subCategory of subCategories) {
      const subSlug = slugify(subCategory);
      
      let subCat = await Category.findOne({ slug: subSlug });
      
      if (!subCat) {
        subCat = await Category.create({
          name: subCategory,
          slug: subSlug,
          parent: mainCat._id,
          level: 2,
          ancestors: [mainCat._id],
          isActive: true,
          order: subOrder++,
        });
        console.log(`  ✓ Created: ${mainCategory} > ${subCategory}`);
        created++;
      } else {
        // Update parent if different
        if (!subCat.parent?.equals(mainCat._id)) {
          subCat.parent = mainCat._id;
          subCat.ancestors = [mainCat._id];
          subCat.level = 2;
          await subCat.save();
          console.log(`  ⟳ Updated: ${mainCategory} > ${subCategory}`);
        } else {
          console.log(`  ○ Exists: ${mainCategory} > ${subCategory}`);
        }
        skipped++;
      }
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 Summary');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ✓ Created: ${created} categories`);
  console.log(`  ○ Skipped: ${skipped} categories (already exist)`);
  console.log('\n✅ Categories created successfully!');

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB\n');
}

createCategories().catch(console.error);

