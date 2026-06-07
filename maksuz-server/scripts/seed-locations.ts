/**
 * Seed script to add Maksuz store locations to the database
 * 
 * Usage: npx ts-node scripts/seed-locations.ts
 * 
 * Data sourced from: https://maksuz.ba/kontakt/
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Location } from '../src/models/Location.model';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maksuz';

const locations = [
  {
    name: "Maksuz kutak Grbavica",
    subtitle: "Centrala",
    address: "Hamdije Čemerlića 49",
    city: "71000 Novo Sarajevo",
    phone: "+387 61 399 366",
    email: "info@maksuz.ba",
    workingHours: {
      weekdays: "08:00 - 16:00",
      saturday: "08:00 - 14:00",
      sunday: "Zatvoreno",
    },
    image: "/maksuzlogo.png",
    mapUrl: "https://maps.google.com/?q=Hamdije+Čemerlića+49,+Novo+Sarajevo",
    features: ["Kompletan asortiman", "Degustacija", "Centrala"],
    isHighlight: true,
    isActive: true,
    order: 0,
  },
  {
    name: "Maksuz kutak Ilidža",
    subtitle: "",
    address: "Bingo City Center",
    city: "71210 Ilidža",
    phone: "+387 62 200 088",
    email: "info@maksuz.ba",
    workingHours: {
      weekdays: "08:00 - 21:00",
      saturday: "08:00 - 21:00",
      sunday: "08:00 - 21:00",
    },
    image: "/maksuzlogo.png",
    mapUrl: "https://maps.google.com/?q=Bingo+City+Center,+Ilidža,+Sarajevo",
    features: ["Kompletan asortiman", "Api Centar u blizini"],
    isHighlight: false,
    isActive: true,
    order: 1,
  },
  {
    name: "Maksuz kutak Zenica",
    subtitle: "",
    address: "TC Džananović",
    city: "72000 Zenica",
    phone: "+387 61 040 020",
    email: "info@maksuz.ba",
    workingHours: {
      weekdays: "08:00 - 20:00",
      saturday: "08:00 - 16:00",
      sunday: "Zatvoreno",
    },
    image: "/maksuzlogo.png",
    mapUrl: "https://maps.google.com/?q=TC+Džananović,+Zenica",
    features: ["Kompletan asortiman", "Lokalni proizvodi"],
    isHighlight: false,
    isActive: true,
    order: 2,
  },
];

async function seedLocations() {
  console.log('🏪 Starting locations seeding...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if locations already exist
    const existingLocations = await Location.find();
    
    if (existingLocations.length > 0) {
      console.log(`⚠️  Found ${existingLocations.length} existing location(s).`);
      console.log('   Deleting existing locations...');
      await Location.deleteMany({});
      console.log('   ✅ Deleted existing locations.\n');
    }

    // Insert new locations
    console.log('📤 Creating locations...\n');
    
    for (const locationData of locations) {
      const location = new Location(locationData);
      await location.save();
      console.log(`✅ Created location: "${locationData.name}"`);
      console.log(`   Address: ${locationData.address}, ${locationData.city}`);
      console.log(`   Phone: ${locationData.phone}`);
      console.log(`   Highlight: ${locationData.isHighlight ? 'Yes (Centrala)' : 'No'}\n`);
    }

    console.log('🎉 Locations seeded successfully!\n');
    console.log('You can now:');
    console.log('  - View locations in Admin -> Poslovnice (/admin/locations)');
    console.log('  - See them on the corporate site\'s Poslovnice section');

  } catch (error) {
    console.error('❌ Error seeding locations:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

seedLocations();
