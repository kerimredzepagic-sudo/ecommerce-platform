/**
 * Seed Script: Product Categories
 * 
 * This script populates the database with all product categories
 * according to the client's requirements from pripremazaweb.pdf
 * 
 * Usage: npx ts-node scripts/seed-categories.ts
 */

import mongoose from 'mongoose';
import { Category } from '../src/models/Category.model';
import dotenv from 'dotenv';

dotenv.config();

// Category hierarchy from PDF requirements
const categoryData = [
  // ========== PIĆA ==========
  {
    name: 'Pića',
    slug: 'pica',
    description: 'Voćni sokovi, sirupi i osvježavajući napici',
    level: 1,
    order: 1,
    children: [
      { name: '100% Voćni sokovi', slug: 'vocni-sokovi', description: 'Prirodni voćni sokovi bez dodataka', order: 1 },
      { name: 'Voćni sirupi', slug: 'vocni-sirupi', description: 'Sirupi od svježeg voća', order: 2 },
      { name: 'Biljni sirupi', slug: 'biljni-sirupi', description: 'Sirupi od ljekovitog bilja', order: 3 },
    ]
  },

  // ========== MED I MEDNE MJEŠAVINE ==========
  {
    name: 'Med i medne mješavine',
    slug: 'med-i-medne-mjesavine',
    description: 'Prirodni med i mješavine sa dodatcima',
    level: 1,
    order: 2,
    children: [
      { name: 'Med', slug: 'med', description: 'Čisti prirodni med', order: 1 },
      { name: 'Medne mješavine', slug: 'medne-mjesavine', description: 'Med sa dodatcima orašastog voća i začina', order: 2 },
      { name: 'Med sa dodacima', slug: 'med-sa-dodacima', description: 'Med obogaćen prirodnim sastojcima', order: 3 },
    ]
  },

  // ========== NAMAZI ==========
  {
    name: 'Namazi',
    slug: 'namazi',
    description: 'Voćni namazi, džemovi i kremovi',
    level: 1,
    order: 3,
    children: [
      { name: 'Džemovi i voćni namazi', slug: 'dzemovi-i-vocni-namazi', description: 'Tradicionalni džemovi od svježeg voća', order: 1 },
      { name: 'Namazi na bazi hurme i orašastog voća', slug: 'hurma-namazi', description: 'Kremasti namazi bez dodanog šećera', order: 2 },
      { name: '100% puteri', slug: 'puteri', description: 'Čisti puteri od orašastog voća', order: 3 },
    ]
  },

  // ========== PEKMEZI ==========
  {
    name: 'Pekmezi',
    slug: 'pekmezi',
    description: 'Tradicionalni pekmezi i imuno pekmezi',
    level: 1,
    order: 4,
    children: [
      { name: '100% Pekmezi', slug: '100-pekmezi', description: 'Čisti voćni pekmezi bez aditiva', order: 1 },
      { name: 'Imuno Pekmezi', slug: 'imuno-pekmezi', description: 'Pekmezi obogaćeni sastojcima za imunitet', order: 2 },
    ]
  },

  // ========== SLANI PROGRAM ==========
  {
    name: 'Slani program',
    slug: 'slani-program',
    description: 'Orašasti plodovi, sjemenke i prerađevine od povrća',
    level: 1,
    order: 5,
    children: [
      { name: 'Orašasti plodovi', slug: 'orasasti-plodovi', description: 'Prženi i sirovi orašasti plodovi', order: 1 },
      { name: 'Sjemenke', slug: 'sjemenke', description: 'Zdrave sjemenke za svakodnevnu upotrebu', order: 2 },
      { name: 'Sosevi i prerađevine od povrća', slug: 'sosevi-i-preradevine', description: 'Ajvar, domaći sosevi i namazi', order: 3 },
    ]
  },

  // ========== SLATKI PROGRAM ==========
  {
    name: 'Slatki program',
    slug: 'slatki-program',
    description: 'Energy balls, suho voće, lokumi i slatkiši',
    level: 1,
    order: 6,
    children: [
      { name: 'Energy balls', slug: 'energy-balls', description: 'Energetske kuglice od suhog voća', order: 1 },
      { name: 'Suho voće', slug: 'suho-voce', description: 'Sušeno voće bez dodataka', order: 2 },
      { name: 'Lokumi i voćni mixevi', slug: 'lokumi-i-vocni-mixevi', description: 'Tradicionalni lokumi i voćne mješavine', order: 3 },
      { name: 'Ostalo', slug: 'slatki-program-ostalo', description: 'Badem u čokoladi i ostali slatkiši', order: 4 },
    ]
  },

  // ========== ULJA I ZAČINI ==========
  {
    name: 'Ulja i začini',
    slug: 'ulja-i-zacini',
    description: 'Domaća ulja, začini i sirće',
    level: 1,
    order: 7,
    children: [
      { name: 'Slatki začini', slug: 'slatki-zacini', description: 'Cimet, vanilija i ostali slatki začini', order: 1 },
      { name: 'Slani začini', slug: 'slani-zacini', description: 'Mješavine začina za slana jela', order: 2 },
      { name: 'Domaće sirće', slug: 'domace-sirce', description: 'Jabukovo sirće i voćna sirća', order: 3 },
      { name: 'Ulja', slug: 'ulja', description: 'Hladno ceđena domaća ulja', order: 4 },
    ]
  },

  // ========== RAZNO ==========
  {
    name: 'Razno',
    slug: 'razno',
    description: 'Žitarice i ostali proizvodi',
    level: 1,
    order: 8,
    children: [
      { name: 'Žitarice', slug: 'zitarice', description: 'Bulgur, kus-kus i ostale žitarice', order: 1 },
    ]
  },
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/maksuz';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing categories.`);
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question('Do you want to delete existing categories and reseed? (yes/no): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Seeding cancelled.');
        await mongoose.disconnect();
        process.exit(0);
      }

      console.log('🗑️  Deleting existing categories...');
      await Category.deleteMany({});
      console.log('✅ Existing categories deleted');
    }

    console.log('🌱 Seeding categories...');

    let totalCreated = 0;

    for (const mainCategory of categoryData) {
      // Create main category (level 1)
      const parent = await Category.create({
        name: mainCategory.name,
        slug: mainCategory.slug,
        description: mainCategory.description,
        level: 1,
        order: mainCategory.order,
        isActive: true,
        ancestors: [],
      });
      totalCreated++;
      console.log(`  📁 Created: ${mainCategory.name}`);

      // Create subcategories (level 2)
      if (mainCategory.children && mainCategory.children.length > 0) {
        for (const subCategory of mainCategory.children) {
          await Category.create({
            name: subCategory.name,
            slug: subCategory.slug,
            description: subCategory.description,
            level: 2,
            order: subCategory.order,
            parent: parent._id,
            ancestors: [parent._id],
            isActive: true,
          });
          totalCreated++;
          console.log(`    └── ${subCategory.name}`);
        }
      }
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Successfully created ${totalCreated} categories!`);
    console.log('═══════════════════════════════════════');

    // Print summary
    const mainCategories = await Category.countDocuments({ level: 1 });
    const subCategories = await Category.countDocuments({ level: 2 });
    console.log(`   📊 Main categories: ${mainCategories}`);
    console.log(`   📊 Subcategories: ${subCategories}`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed script
seedCategories();
