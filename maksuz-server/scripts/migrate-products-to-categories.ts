/**
 * Migration Script: Map Products to New Categories
 * 
 * This script maps all existing products to the correct categories
 * based on product names and patterns.
 * 
 * Usage: npx ts-node scripts/migrate-products-to-categories.ts
 */

import mongoose from 'mongoose';
import { Product } from '../src/models/Product.model';
import { Category } from '../src/models/Category.model';
import dotenv from 'dotenv';

dotenv.config();

// Define mapping rules: [pattern, category slug, product line (optional)]
// Patterns are case-insensitive regex
type ProductLine = 'originals' | 'premium' | 'health' | 'energy' | null;
type MappingRule = [RegExp, string, ProductLine?];

const mappingRules: MappingRule[] = [
  // ═══════════════════════════════════════════════════════════════
  // IMPORTANT: Rules are evaluated top-to-bottom, first match wins.
  // More specific patterns MUST come before generic ones to avoid
  // misclassification (e.g., "Čoko badem" must match čoko before badem).
  // ═══════════════════════════════════════════════════════════════

  // ========== MED I MEDNE MJEŠAVINE ==========
  // Med sa dodacima (med + ingredient) — must come before čisti med
  [/med.*cimet|med.*đumbir|med.*kurkuma|med.*glog|med.*lješnjak|med.*orah|med.*polen|med.*propolis|med.*kopriva|med.*voće|med.*matična|dječiji med|med.*borove/i, 'med-sa-dodacima', 'health'],
  // Čisti med
  [/^med\s|bagrem\s*med|livada\s*med|medljikovac|šumski\s*med|kesten\s*med|kadulja\s*med|med\s*u\s*saću|med\s*u\s*saču|med\s*u\s*ćupu|med\s*kesten|med\s*polen\s*270/i, 'med', 'originals'],
  // Medne mješavine
  [/maksuz\s*vitamin|protein.*suho\s*voće/i, 'medne-mjesavine', 'health'],

  // ========== PROPOLIS — before ulja (to prevent "propolis sa maslinovim uljem" matching ulja) ==========
  [/propolis|polen/i, 'med-sa-dodacima', 'health'],

  // ========== PIĆA ==========
  // 100% Voćni sokovi — added jabuka kisela, SOK JABUKA DUMBIR
  [/^jabuka$|^jabuka\s+i|jabuka\s+kisela|^nar$|^aronija$|^kupina$|^malina$|^ribizla$|bestilj|volovsko\s*srce\s*sok|jabuka.*đumbir.*sok|sok.*jabuka.*đumbir|brusnica\s*planinska|borovnica\s*planinska|jabuka.*cvekla.*mrkva|bobičasto\s*voće/i, 'vocni-sokovi', 'originals'],
  // Voćni sirupi
  [/sirup\s*(jagoda|višnja|trešnja|drenjak|maksuz\s*vitamin)/i, 'vocni-sirupi', 'originals'],
  // Biljni sirupi — added đumbir i limun (ginger-lemon syrup)
  [/sirup\s*(nana|kopriva|zova|melisa|ruža)|đumbir\s*i\s*limun/i, 'biljni-sirupi', 'health'],

  // ========== NAMAZI ==========
  // 100% puteri — must come before orašasti plodovi (to prevent "badem puter" matching badem)
  [/100%.*puter|badem\s*puter|indijski\s*orah\s*puter|lješnjak\s*puter|kikiriki\s*puter|puter.*sjemenke|pistacija\s*puter|puter\s*lješnjak|puter\s*badem|puter\s*indisjki/i, 'puteri', 'premium'],
  // Džemovi i voćni namazi
  [/džem|džam|ekstra.*džem/i, 'dzemovi-i-vocni-namazi', 'originals'],
  // Namazi na bazi hurme — specific hurma spread products only (not energy balls with hurma)
  [/hurma.*tahin|hurma\s*krem|smokva.*hurma|marelica.*hurma|grožđice.*hurma|brusnica.*hurma|šljiva.*hurma|pistacija\s*krem|tahin\s*pasta/i, 'hurma-namazi', 'premium'],

  // ========== PEKMEZI ==========
  // Imuno pekmezi — must come before generic pekmez
  [/imuno\s*pekmez/i, 'imuno-pekmezi', 'health'],
  // 100% Pekmezi
  [/pekmez/i, '100-pekmezi', 'originals'],

  // ========== SLATKI PROGRAM (before Slani program to catch chocolate-coated nuts) ==========
  // Energy balls — must come before hurma/orašasti patterns
  [/energy\s*ball/i, 'energy-balls', 'energy'],
  // Slatki program ostalo — čokoladni proizvodi, must come BEFORE orašasti plodovi
  // so "Čoko badem", "Čoko kikiriki", "Badem tiramisu" etc. are correctly categorized
  [/čoko|čokolad|slatki\s*badem|gumene\s*bombe|gumene\s*bombone|mevludske|rainbow|kapućino|moka|trileće/i, 'slatki-program-ostalo', 'originals'],
  // Susam kombinacije (slatki program) — before sjemenke to prevent matching susam there
  [/susam\s*(lješnjak|leblebija|kikiriki)/i, 'slatki-program-ostalo', 'originals'],
  // Suho voće
  [/suho\s*voće|suha\s*(šljiva|smokva)|grožđica|suho\s*grožđe|medinska\s*hurma|kraljevska\s*hurma|marelica\s*natural|marelica(?!\s*i\s*hurma)|tropik\s*mix|papaja|mango|limeta\s*suha|kivi\s*suhi|jagoda\s*suha|ginger|egzotik\s*mix|ananas|brusnica(?!\s*(planinska|i\s*hurma))|đumbir\s*sušeni|crna\s*grožđica|banana\s*čips/i, 'suho-voce', 'originals'],
  // Lokumi i voćni mixevi
  [/lokum|atom\s*lokum|maksuz\s*voćni\s*mix|hurma\s*orah\s*lješnjak|carski\s*kolač\s*mix|žele/i, 'lokumi-i-vocni-mixevi', 'originals'],

  // ========== SLANI PROGRAM (after slatki to avoid stealing chocolate-coated products) ==========
  // Orašasti plodovi — added jezgro kajsije
  [/badem(?!\s*puter)|orah\s*jezgra|lješnjak\s*(sirovi|pečeni|ljuska)|leblebija\s*pržena|kikiriki|indijski\s*orah(?!\s*puter)|brazilski\s*orah|pistacija(?!\s*krem)|orah\s*ljuska|badem\s*blanširani|badem\s*ljuska|studentski\s*mix|jezgro?\s*kajsij/i, 'orasasti-plodovi', 'originals'],
  // Sjemenke
  [/sjeme|sjemenke|chia|košpic|lan|suncokret|tikve\s*(pečen|sirov)|jezgro\s*tikve|piskavica|susam(?!\s*(kikiriki|lješnjak|leblebija))/i, 'sjemenke', 'originals'],
  // Sosevi i prerađevine od povrća
  [/ajvar|sos\s*(kikiriki|indijski)|suhi\s*paradajz/i, 'sosevi-i-preradevine', 'originals'],

  // ========== ULJA I ZAČINI ==========
  // Ulja — made more specific to avoid matching "propolis sa maslinovim uljem"
  [/^ulje\b|^maslinovo|ulje\s*(crnog?\s*kima|kokosovo|maslinovo|bademovo|lješnjak|sezamovo|susamovo|tikve?|konopljino|orahovo|laneno)|maslinovo\s*ulje|kokosovo\s*ulje|djevičansko.*ulje|tikva\s*ulje/i, 'ulja', 'premium'],
  // Domaće sirće
  [/sirće/i, 'domace-sirce', 'originals'],
  // Slani začini — added plavi mak
  [/origano|kumin|paprika|sumak|čili|luk|ruzmarin|peršun|muškatni|mažuran|lovor|korijander|komorač|karanfilčić|želatin|đumbir\s*u\s*prahu|celer|bosiljak|biber|anis|kurkuma|kim|kari|bijeli\s*luk|kopar|plavi\s*mak/i, 'slani-zacini', 'originals'],
  // Slatki začini
  [/cimet|kakao|rogač|vanilij/i, 'slatki-zacini', 'originals'],

  // ========== RAZNO ==========
  // Žitarice — added tornado cips as a snack/misc item
  [/kinoa|proso|amarant|heljda|bulgur|pahuljice|kukuruz|slanutak|grah|leća|tornado\s*[čc]ips/i, 'zitarice', 'originals'],

  // ========== ČAJEVI ==========
  [/čaj|kamilica|menta|majčina\s*dušica|vrkuta|vrbovica|sljez|pelin|kukuruz\s*svila|kopriva\s*korijen|kadulja|lavanda|matičnjak/i, 'biljni-sirupi', 'health'],

  // ========== POKLON PAKETI ==========
  [/poklon|korpa|buket|3u1|api\s*(mini|full)|celofan|suhi\s*kadaif/i, 'slatki-program-ostalo', null],

  // ========== FALLBACK FOR SPECIFIC PRODUCTS ==========
  [/kokosovo\s*brašno/i, 'zitarice', 'originals'],
  [/product\s*01|^test$/i, 'slatki-program-ostalo', null],
];

async function migrateProducts() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/maksuz';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Load all categories into a map
    const categories = await Category.find().lean();
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();
    
    for (const cat of categories) {
      categoryMap.set(cat.slug, cat._id);
    }
    
    console.log(`📁 Loaded ${categories.length} categories\n`);

    // Get all products
    const products = await Product.find().lean();
    console.log(`📦 Found ${products.length} products to migrate\n`);

    let mapped = 0;
    let unmapped = 0;
    const unmappedProducts: string[] = [];
    const categoryStats: Record<string, number> = {};
    const lineStats: Record<string, number> = { originals: 0, premium: 0, health: 0, energy: 0, none: 0 };

    for (const product of products) {
      let matched = false;
      
      for (const [pattern, categorySlug, line] of mappingRules) {
        if (pattern.test(product.name)) {
          const categoryId = categoryMap.get(categorySlug);
          
          if (categoryId) {
            // Update product
            const updateData: Record<string, unknown> = { category: categoryId };
            if (line) {
              updateData.line = line;
              lineStats[line]++;
            } else {
              lineStats.none++;
            }
            
            await Product.findByIdAndUpdate(product._id, updateData);
            
            mapped++;
            matched = true;
            
            // Stats
            if (!categoryStats[categorySlug]) categoryStats[categorySlug] = 0;
            categoryStats[categorySlug]++;
            
            break; // Stop at first match
          } else {
            console.log(`⚠️  Category not found: ${categorySlug} for product: ${product.name}`);
          }
        }
      }
      
      if (!matched) {
        unmapped++;
        unmappedProducts.push(product.name);
      }
    }

    // Print results
    console.log('\n═══════════════════════════════════════');
    console.log('📊 MIGRATION RESULTS');
    console.log('═══════════════════════════════════════\n');
    
    console.log(`✅ Mapped: ${mapped} products`);
    console.log(`❌ Unmapped: ${unmapped} products\n`);
    
    console.log('📁 Products per category:');
    const sortedStats = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
    for (const [slug, count] of sortedStats) {
      console.log(`   ${slug}: ${count}`);
    }
    
    console.log('\n🏷️ Products per line:');
    console.log(`   Originals: ${lineStats.originals}`);
    console.log(`   Premium: ${lineStats.premium}`);
    console.log(`   Health: ${lineStats.health}`);
    console.log(`   Energy: ${lineStats.energy}`);
    console.log(`   No line: ${lineStats.none}`);
    
    if (unmappedProducts.length > 0) {
      console.log('\n⚠️  Unmapped products:');
      unmappedProducts.forEach(name => console.log(`   - ${name}`));
    }

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrateProducts();
