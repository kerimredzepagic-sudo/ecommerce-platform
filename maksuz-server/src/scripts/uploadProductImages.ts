/**
 * Script to map local product images to database products,
 * upload them to Google Cloud Storage, and update product records.
 *
 * Usage:
 *   cd maksuz-server
 *   npx ts-node src/scripts/uploadProductImages.ts --dry-run   # Preview mapping only
 *   npx ts-node src/scripts/uploadProductImages.ts              # Upload and update
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Product } from '../models/Product.model';
import { connectDatabase } from '../config/database';
import { uploadService } from '../services/upload.service';

// ── Config ──────────────────────────────────────────────────────────────────

const IMAGES_DIR = path.resolve(__dirname, '../../../Maksuz Korpa & Web shop fotografije');
const DRY_RUN = process.argv.includes('--dry-run');
const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 1200;
const IMAGE_QUALITY = 85;

// ── Image Type Classification ───────────────────────────────────────────────

type ImageType = 'main' | 'deklaracija' | 'hranjiva-vrijednost' | 'halal' | 'tegla' | 'pakovanje' | 'lifestyle' | 'other';

function classifyImage(filename: string): ImageType {
  const lower = filename.toLowerCase();
  if (lower.includes('lifestyle')) return 'lifestyle';
  if (lower.includes('pakovanje')) return 'pakovanje';
  if (lower.includes('tegla')) return 'tegla';
  if (lower.includes('hranjiva-vrijednost') && lower.includes('halal')) return 'halal';
  if (lower.includes('hranjiva-vrijednost')) return 'hranjiva-vrijednost';
  if (lower.includes('deklaracija') && lower.includes('hranjiva-vrijednost')) return 'hranjiva-vrijednost';
  if (lower.includes('deklaracija')) return 'deklaracija';
  if (lower.includes('halal') && !lower.includes('hranjiva')) return 'halal';
  if (lower.includes('domaće') && !lower.includes('deklaracija')) return 'other';
  return 'main';
}

function imageTypeToAlt(type: ImageType, productName: string): string {
  switch (type) {
    case 'main': return productName;
    case 'deklaracija': return `${productName} - deklaracija`;
    case 'hranjiva-vrijednost': return `${productName} - hranjiva vrijednost`;
    case 'halal': return `${productName} - halal certifikat`;
    case 'tegla': return `${productName} - tegla`;
    case 'pakovanje': return `${productName} - pakovanje`;
    case 'lifestyle': return `${productName} - lifestyle`;
    case 'other': return productName;
  }
}

// ── Filename → Group Key extraction ─────────────────────────────────────────

function getGroupKey(filename: string): string {
  let name = filename.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');

  // Health - Medna mješavina
  if (/^Maksuz-Health-Medna-mješavina-Med-/i.test(name)) {
    let rest = name.replace(/^Maksuz-Health-Medna-mješavina-Med-/i, '');
    rest = rest.replace(/-domaći-proizvod.*$/, '');
    return `health-med-${rest.toLowerCase()}`;
  }

  if (/^Maksuz-Health-Dječiji-med/i.test(name)) return 'health-djeciji-med';

  // Health - Propolis
  if (/^Maksuz-Health-Propolis/i.test(name)) {
    let rest = name.replace(/^Maksuz-Health-Propolis-/i, '');
    rest = rest.replace(/-domaći-proizvod.*$/, '');
    if (rest.includes('maslinovo-ulje')) {
      if (rest.startsWith('kapi') || rest.includes('kapi-maslinovo') || rest.includes('kapi-sprej-maslinovo')) {
        return 'health-propolis-kapi-maslinovo-ulje';
      }
      if (rest.startsWith('sprej') || rest.includes('sprej-maslinovo') || rest.includes('sprej-kapi-maslinovo')) {
        return 'health-propolis-sprej-maslinovo-ulje';
      }
    }
    if (rest.startsWith('kapi') && !rest.includes('maslinovo')) return 'health-propolis-kapi';
    if (rest.startsWith('sprej') && !rest.includes('maslinovo')) return 'health-propolis-sprej';
    return 'health-propolis-' + rest.toLowerCase().split('-')[0];
  }

  // Health - Sokovi
  if (/^Maksuz-Health-domaći-sok-100/i.test(name)) {
    let rest = name.replace(/^Maksuz-Health-domaći-sok-100_-/i, '');
    rest = rest.replace(/-deklaracija.*$/, '').replace(/-hranjiva.*$/, '');
    return `health-sok-${rest.toLowerCase()}`;
  }

  // Health - Imuno
  if (/^Maksuz-Health-imuno-mješavina/i.test(name)) {
    if (name.includes('kiseli')) return 'health-imuno-kiseli';
    if (name.includes('slatki')) return 'health-imuno-slatki';
    return 'health-imuno';
  }

  // Health - Poklon
  if (/^Maksuz-Health-linija-poklon-paket-velika/i.test(name)) return 'health-poklon-veliki';
  if (/^Maksuz-Health-linija-poklon-paket/i.test(name)) return 'health-poklon-mali';
  if (/^Maksuz-health-mix/i.test(name)) return 'health-poklon-mali';

  // Energy - Atom lokum
  if (/^Maksuz-energy-atom-lokum-hurma-/i.test(name)) {
    let rest = name.replace(/^Maksuz-energy-atom-lokum-hurma-/i, '');
    rest = rest.replace(/-(balls|kuglica|domaći).*$/, '');
    return `energy-atom-lokum-${rest.toLowerCase()}`;
  }

  // Energy - Balls
  if (/^Maksuz-energy-balls-kuglice-/i.test(name)) {
    let rest = name.replace(/^Maksuz-energy-balls-kuglice-/i, '');
    rest = rest.replace(/-domaći-proizvod.*$/, '');
    return `energy-balls-${rest.toLowerCase()}`;
  }

  if (/^Maksuz-energy-hurma-orah-lješnjak/i.test(name)) return 'energy-hurma-orah-ljesnjak';
  if (/^Maksuz-energy-lokum-orah-badem/i.test(name)) return 'energy-lokum-orah-badem';
  if (/^Maksuz-energy-mix-suhog-orašastog-voća-180g/i.test(name)) return 'energy-mix-180g';
  if (/^Maksuz-energy-mix-suhog-orašastog-voća-280g/i.test(name)) return 'energy-mix-280g';
  if (/^Maksuz-Energy-linija-poklon-paket/i.test(name)) return 'energy-poklon-mali';

  // Originals - Ajvar
  if (/^Maksuz-Originals-Ajvar-blagi/i.test(name)) return 'originals-ajvar-blagi';
  if (/^Maksuz-Originals-Ajvar-ljuti/i.test(name)) return 'originals-ajvar-ljuti';

  // Originals - Krem namazi
  if (/^Maksuz-Originals-Badem-tamni-krem/i.test(name)) return 'originals-badem-tamni-krem';
  if (/^Maksuz-Originals-Hurma-Tahin-pasta-krem/i.test(name)) return 'originals-hurma-tahin';
  if (/^Maksuz-Originals-Hurma-krem/i.test(name)) return 'originals-hurma-krem';
  if (/^Maksuz-Originals-Indijski-orah-ruby-krem/i.test(name)) return 'originals-indijski-orah-ruby';
  if (/^Maksuz-Originals-Kikiriki-Crunchy/i.test(name)) return 'originals-kikiriki-crunchy';
  if (/^Maksuz-Originals-Kikiriki-kremasti/i.test(name)) return 'originals-kikiriki-kremasti';
  if (/^Maksuz-Originals-Lješnjak-bijeli-krem/i.test(name)) return 'originals-ljesnjak-bijeli-krem';
  if (/^Maksuz-Originals-Pistacija-krem/i.test(name)) return 'originals-pistacija-krem';
  if (/^Maksuz-Originals-Sjeme-tikve/i.test(name)) return 'originals-sjeme-tikve';
  if (/^Maksuz-Originals-Tahin-pasta-krem/i.test(name)) return 'originals-tahin-pasta';

  // Originals - Bestilj
  if (/^Maksuz-Originals-Bestilj/i.test(name)) return 'originals-bestilj';

  // Originals - Džemovi
  if (/^Maksuz-Originals-Jagoda-Ekstra-džem/i.test(name)) return 'originals-dzem-jagoda';
  if (/^Maksuz-Originals-ekstra-džem-jagoda/i.test(name)) return 'originals-dzem-jagoda';
  if (/^Maksuz-Originals-Marelica-Ekstra-džem/i.test(name)) return 'originals-dzem-marelica';
  if (/^Maksuz-Originals-ekstra-džem-marelica/i.test(name)) return 'originals-dzem-marelica';
  if (/^Maksuz-Originals-Smokva-Ekstra-džem/i.test(name)) return 'originals-dzem-smokva';
  if (/^Maksuz-Originals-ekstra-džem-smokva/i.test(name)) return 'originals-dzem-smokva';
  if (/^Maksuz-Originals-Šipurak-Ekstra-džem/i.test(name)) return 'originals-dzem-sipurak';
  if (/^Maksuz-Originals-ekstra-džem-šipurak/i.test(name)) return 'originals-dzem-sipurak';

  // Originals - Paradajz
  if (/^Maksuz-Originals-Prirodni-domaći-paradajz-sok-volovsko/i.test(name)) return 'originals-paradajz-sok';
  if (/^Maksuz-Originals-Volovsko-srce-paradajz-sos/i.test(name)) return 'originals-paradajz-sos';

  // Originals - Sokovi
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-jabuka-cvekla-mrkva/i.test(name)) return 'originals-sok-jabuka-cvekla-mrkva';
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-jabuka-dunja/i.test(name)) return 'originals-sok-jabuka-dunja';
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-jabuka-kisela/i.test(name)) return 'originals-sok-jabuka-kisela';
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-jabuka-kruška/i.test(name)) return 'originals-sok-jabuka-kruska';
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-jabuka-nar/i.test(name)) return 'originals-sok-jabuka-nar';
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-jabuka-slatka/i.test(name)) return 'originals-sok-jabuka-slatka';
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-jabuka-šljiva/i.test(name)) return 'originals-sok-jabuka-sljiva';
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-jabuka-đumbir/i.test(name)) return 'originals-sok-jabuka-djumbir';
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-tikva-mrkva/i.test(name)) return 'originals-sok-tikva-mrkva';
  if (/^Maksuz-Originals-Prirodni-domaći-sok-100_-voće-vitamin/i.test(name)) return 'originals-sok-vitamin';

  // Originals - Poklon
  if (/^Maksuz-Originals-linija-poklon-paket-velika/i.test(name)) return 'originals-poklon-veliki';
  if (/^Maksuz-Originals-linija-poklon-paket/i.test(name)) return 'originals-poklon-mali';

  // Premium - Med (order matters: saću before general Bagrem)
  if (/^Maksuz-Premium-Prirodni-Pravi-med-Bagrem-u-saću/i.test(name)) return 'premium-med-bagrem-sacu';
  if (/^Maksuz-Premium-Prirodni-Pravi-med-Bagrem/i.test(name)) return 'premium-med-bagrem';
  if (/^Maksuz-Premium-Prirodni-Pravi-med-Kadulja/i.test(name)) return 'premium-med-kadulja';
  if (/^Maksuz-Premium-Prirodni-Pravi-med-Kesten/i.test(name)) return 'premium-med-kesten';
  if (/^Maksuz-Premium-Prirodni-Pravi-med-Livada/i.test(name)) return 'premium-med-livada';
  if (/^Maksuz-Premium-Prirodni-Pravi-med-Medljikovac/i.test(name)) return 'premium-med-medljikovac';
  if (/^Maksuz-Premium-Prirodni-Pravi-med-Šumski/i.test(name)) return 'premium-med-sumski';

  // Premium - Puteri
  if (/^Maksuz-Premium-100_-badem-puter/i.test(name)) return 'premium-badem-puter';
  if (/^Maksuz-Premium-100_-indijski-orah-puter/i.test(name)) return 'premium-indijski-orah-puter';
  if (/^Maksuz-Premium-100_-kikiriki-puter/i.test(name)) return 'premium-kikiriki-puter';
  if (/^Maksuz-Premium-100_-lješnjak-puter/i.test(name)) return 'premium-ljesnjak-puter';
  if (/^Maksuz-Premium-100_-pistacija-puter/i.test(name)) return 'premium-pistacija-puter';

  // Premium - Sirupi
  if (/^Maksuz-Premium-Drenjak-Sirup/i.test(name)) return 'premium-sirup-drenjak';
  if (/^Maksuz-Premium-Jagoda-Sirup/i.test(name)) return 'premium-sirup-jagoda';
  if (/^Maksuz-Premium-Kopriva-Sirup/i.test(name)) return 'premium-sirup-kopriva';
  if (/^Maksuz-Premium-Malina-Sirup/i.test(name)) return 'premium-sirup-malina';
  if (/^Maksuz-Premium-Menta-Melisa-Sirup/i.test(name)) return 'premium-sirup-menta-melisa';
  if (/^Maksuz-Premium-Nana-Menta-Sirup/i.test(name)) return 'premium-sirup-nana';
  if (/^Maksuz-Premium-Ruža-Sirup/i.test(name)) return 'premium-sirup-ruza';
  if (/^Maksuz-Premium-[Tt]rešnja-Sirup/i.test(name)) return 'premium-sirup-tresnja';
  if (/^Maksuz-Premium-Višnja-Sirup/i.test(name)) return 'premium-sirup-visnja';
  if (/^Maksuz-Premium-Vitamin-Sirup/i.test(name)) return 'premium-sirup-vitamin';
  if (/^Maksuz-Premium-Zova-Sirup/i.test(name)) return 'premium-sirup-zova';
  if (/^Maksuz-Premium-Đumbir-Limun-Sirup/i.test(name)) return 'premium-sirup-djumbir-limun';

  // Premium - Poklon
  if (/^Maksuz-Premium-linija-poklon-paket-velika/i.test(name)) return 'premium-poklon-veliki';
  if (/^Maksuz-Premium-linija-poklon-paket/i.test(name)) return 'premium-poklon-mali';
  if (/^Maksuz-premium-mix/i.test(name)) return 'premium-poklon-mali';
  if (/^Maksuz-premium-poklon-paket-3u1/i.test(name)) return 'premium-3u1';

  // Poklon korpe
  if (/^Maksuz-poklon-korpa-mala/i.test(name)) return 'poklon-korpa-mala';
  if (/^Maksuz-poklon-korpa-srednja/i.test(name)) return 'poklon-korpa-srednja';
  if (/^Maksuz-poklon-korpa-velika/i.test(name)) return 'poklon-korpa-velika';

  return name.toLowerCase().replace(/\s+/g, '-');
}

// ── Group Key → Product Slug mapping ────────────────────────────────────────

const GROUP_TO_SLUG: Record<string, string> = {
  // Health - Medne mješavine
  'health-med-cimet': 'med-cimet',
  'health-med-glog-cvijet': 'med-glog',
  'health-med-kurkuma': 'med-kurkuma',
  'health-med-polen': 'med-polen-270gr',
  'health-med-polen-mljeveni': 'polen-mljeveni',
  'health-med-polen-propolis': 'med-polen-i-propolis',
  'health-med-polen-zrno': 'polen-zrno',
  'health-med-sjeme-čurekota': 'med-sjeme-curekota',
  'health-med-suho-voće': 'med-suho-voce',
  'health-med-borove-iglice': 'med-borove-iglice',
  'health-med-lješnjak': 'med-ljesnjak',
  'health-med-orah': 'med-orah',
  'health-med-orašasto-voće': 'med-orasasto-voce',
  'health-med-sjeme-koprive': 'med-sjeme-koprive',
  'health-med-zeleni-orah': 'med-zeleni-orah',
  'health-med-đumbir': 'med-djumbir',

  // Health - Dječiji med
  'health-djeciji-med': 'djeciji-med',

  // Health - Propolis
  'health-propolis-kapi': 'propolis-kapi',
  'health-propolis-sprej': 'propolis-sprej',
  'health-propolis-kapi-maslinovo-ulje': 'propolis-kapi-sa-maslinovim-uljem',
  'health-propolis-sprej-maslinovo-ulje': 'propolis-sprej-sa-maslinovim-uljem',

  // Health - Sokovi
  'health-sok-aronija': 'aronija',
  'health-sok-bobičasto-voće': 'bobicasto-voce',
  'health-sok-kupina': 'kupina',
  'health-sok-malina': 'malina',
  'health-sok-nar': 'nar',
  'health-sok-planinska-borovnica': 'borovnica-planinska',
  'health-sok-planinska-brusnica': 'brusnica-planinska',
  'health-sok-ribizla': 'ribizla',

  // Health - Imuno pekmez
  'health-imuno-kiseli': 'imuno-pekmez-kiseli',
  'health-imuno-slatki': 'imuno-pekmez-slatki',

  // Health - Poklon paketi
  'health-poklon-mali': 'health-poklon-paket',
  'health-poklon-veliki': 'health-poklon-paket-veliki',

  // Energy - Atom lokum
  'energy-atom-lokum-badem': 'atom-lokum-badem',
  'energy-atom-lokum-lješnjak': 'atom-lokum-ljesnjak',
  'energy-atom-lokum-orah': 'atom-lokum-orah',

  // Energy - Balls/kuglice
  'energy-balls-hurma-brusnica': 'brusnica-i-hurma',
  'energy-balls-hurma-grožđice': 'grozdjice-i-hurma',
  'energy-balls-hurma-marelica': 'marelica-i-hurma',
  'energy-balls-hurma-šljiva': 'sljiva-i-hurma',
  'energy-balls-smokva-hurma-šljiva': 'smokva-hurma-i-sljiva',
  'energy-balls-šljiva-grožđice-hurma-whey-protein': 'protein-i-suho-voce',

  // Energy - Other
  'energy-hurma-orah-ljesnjak': 'hurma-orah-ljesnjak-mix',
  'energy-lokum-orah-badem': 'maksuz-lokum',
  'energy-mix-180g': 'maksuz-vocni-mix',
  'energy-mix-280g': 'maksuz-vocni-mix',
  'energy-poklon-mali': 'energy-poklon-paket-mali',

  // Originals - Ajvar
  'originals-ajvar-blagi': 'ajvar-blagi',
  'originals-ajvar-ljuti': 'ajvar-ljuti',

  // Originals - Krem namazi
  'originals-badem-tamni-krem': 'puter-badem-tamni-krem',
  'originals-hurma-tahin': 'hurma-i-tahin',
  'originals-hurma-krem': 'hurma-krem',
  'originals-indijski-orah-ruby': 'puter-indisjki-orahampruby-krem',
  'originals-kikiriki-crunchy': 'kikiriki-crunchy-puter-200gr',
  'originals-kikiriki-kremasti': 'kikiriki-puter-kremasti-200gr',
  'originals-ljesnjak-bijeli-krem': 'puter-ljesnjak-bijeli-krem',
  'originals-pistacija-krem': 'pistacija-krem-45',
  'originals-sjeme-tikve': 'puter-sjemenke-tikve-200gr',
  'originals-tahin-pasta': 'tahin-pasta',

  // Originals - Bestilj
  'originals-bestilj': 'bestilj',

  // Originals - Džemovi
  'originals-dzem-jagoda': 'maksuz-originals-jagoda-ekstra-dzem-domaci-proizvod',
  'originals-dzem-marelica': 'dzem-marelica',
  'originals-dzem-smokva': 'smokva-dzem',
  'originals-dzem-sipurak': 'sipurak-dzem',

  // Originals - Paradajz
  'originals-paradajz-sok': 'volovsko-srce-sok',
  'originals-paradajz-sos': 'volovsko-srce-sok',

  // Originals - Sokovi
  'originals-sok-jabuka-cvekla-mrkva': 'jabuka-cvekla-i-mrkva',
  'originals-sok-jabuka-dunja': 'jabuka-i-dunja',
  'originals-sok-jabuka-kisela': 'jabuka-kisela',
  'originals-sok-jabuka-kruska': 'jabuka-i-kruska',
  'originals-sok-jabuka-nar': 'jabuka-i-nar',
  'originals-sok-jabuka-slatka': 'jabuka',
  'originals-sok-jabuka-sljiva': 'jabuka-i-sljiva',
  'originals-sok-jabuka-djumbir': 'sok-jabuka-umbir',
  'originals-sok-tikva-mrkva': 'maksuz-vitamin',
  'originals-sok-vitamin': 'maksuz-vitamin',

  // Originals - Poklon
  'originals-poklon-mali': 'originals-poklon-paket-mali',
  'originals-poklon-veliki': 'originals-poklon-paket-veliki',

  // Premium - Med
  'premium-med-bagrem': 'bagrem-med',
  'premium-med-bagrem-sacu': 'med-u-sacu',
  'premium-med-kadulja': 'med-kadulja',
  'premium-med-kesten': 'med-kesten',
  'premium-med-livada': 'livada-med',
  'premium-med-medljikovac': 'medljikovac-med',
  'premium-med-sumski': 'sumski-med',

  // Premium - Puteri
  'premium-badem-puter': '100-badem-puter',
  'premium-indijski-orah-puter': 'indijski-orah-puter',
  'premium-kikiriki-puter': '100-kikiriki-puter',
  'premium-ljesnjak-puter': 'ljesnjak-puter',
  'premium-pistacija-puter': 'pistacija-puter-200-gr',

  // Premium - Sirupi
  'premium-sirup-drenjak': 'sirup-drenjak-750ml',
  'premium-sirup-jagoda': 'sirup-jagoda-750ml',
  'premium-sirup-kopriva': 'sirup-kopriva-750ml',
  'premium-sirup-malina': 'malina',
  'premium-sirup-menta-melisa': 'sirup-nana-i-melisa-750ml',
  'premium-sirup-nana': 'sirup-nana-750ml',
  'premium-sirup-ruza': 'sirup-ruza-750ml',
  'premium-sirup-tresnja': 'sirup-tresnja-750ml',
  'premium-sirup-visnja': 'sirup-visnja-750ml',
  'premium-sirup-vitamin': 'sirup-maksuz-vitamin-750ml',
  'premium-sirup-zova': 'sirup-zova-750ml',
  'premium-sirup-djumbir-limun': 'djumbir-i-limun',

  // Premium - Poklon
  'premium-poklon-mali': 'premium-poklon-paket-mali',
  'premium-poklon-veliki': 'premium-poklon-paket-veliki',
  'premium-3u1': 'maksuz-3u1',

  // Poklon korpe
  'poklon-korpa-mala': 'maksuz-korpa-mala',
  'poklon-korpa-srednja': 'maksuz-korpa-srednja',
  'poklon-korpa-velika': 'maksuz-korpa-velika',
};

// ── Image Optimization ──────────────────────────────────────────────────────

async function optimizeImage(
  buffer: Buffer,
  mimetype: string
): Promise<{ buffer: Buffer; mimetype: string }> {
  try {
    let sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();

    if (
      (metadata.width && metadata.width > MAX_IMAGE_WIDTH) ||
      (metadata.height && metadata.height > MAX_IMAGE_HEIGHT)
    ) {
      sharpInstance = sharpInstance.resize(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    let optimizedBuffer: Buffer;
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
        optimizedBuffer = await sharpInstance.toBuffer();
    }

    return { buffer: optimizedBuffer, mimetype };
  } catch (error) {
    console.error('Image optimization failed:', error);
    return { buffer, mimetype };
  }
}

function getMimetype(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Product Image Upload Script ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE (will upload & update)'}`);
  console.log(`Images directory: ${IMAGES_DIR}\n`);

  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
    .sort();

  console.log(`Found ${imageFiles.length} image files\n`);

  // Group images by product
  const groups: Record<string, { files: string[]; types: Map<string, string> }> = {};

  for (const file of imageFiles) {
    const groupKey = getGroupKey(file);
    if (!groups[groupKey]) {
      groups[groupKey] = { files: [], types: new Map() };
    }
    groups[groupKey].files.push(file);
    groups[groupKey].types.set(file, classifyImage(file));
  }

  console.log(`Grouped into ${Object.keys(groups).length} product groups\n`);

  // Connect to database
  await connectDatabase();

  const allProducts = await Product.find({}).lean();
  const slugMap = new Map(allProducts.map(p => [p.slug, p]));

  console.log(`Found ${allProducts.length} products in database\n`);

  let matched = 0;
  let unmatched = 0;
  let uploaded = 0;
  let failed = 0;
  const unmatchedGroups: string[] = [];

  const typeOrder: Record<ImageType, number> = {
    'main': 0,
    'pakovanje': 1,
    'tegla': 2,
    'deklaracija': 3,
    'hranjiva-vrijednost': 4,
    'halal': 5,
    'lifestyle': 6,
    'other': 7,
  };

  for (const [groupKey, group] of Object.entries(groups)) {
    const targetSlug = GROUP_TO_SLUG[groupKey];

    if (!targetSlug) {
      unmatched++;
      unmatchedGroups.push(`  [NO MAPPING] ${groupKey} (${group.files.length} images)`);
      continue;
    }

    const product = slugMap.get(targetSlug);
    if (!product) {
      unmatched++;
      unmatchedGroups.push(`  [NO PRODUCT] ${groupKey} -> slug "${targetSlug}" not found (${group.files.length} images)`);
      continue;
    }

    matched++;

    const sortedFiles = [...group.files].sort((a, b) => {
      const typeA = group.types.get(a) || 'other';
      const typeB = group.types.get(b) || 'other';
      return (typeOrder[typeA as ImageType] || 99) - (typeOrder[typeB as ImageType] || 99);
    });

    console.log(`\n[${groupKey}] -> "${product.name}" (${product.slug})`);
    for (const file of sortedFiles) {
      const type = group.types.get(file) || 'other';
      console.log(`  ${type.padEnd(20)} ${file}`);
    }

    if (!DRY_RUN) {
      const imageEntries: Array<{ url: string; alt: string; isPrimary: boolean }> = [];

      for (let i = 0; i < sortedFiles.length; i++) {
        const file = sortedFiles[i];
        const imgType = (group.types.get(file) || 'other') as ImageType;
        const filePath = path.join(IMAGES_DIR, file);

        try {
          const rawBuffer = fs.readFileSync(filePath);
          const mimetype = getMimetype(file);
          const { buffer: optimizedBuffer, mimetype: finalMime } = await optimizeImage(rawBuffer, mimetype);

          const result = await uploadService.uploadFile(optimizedBuffer, file, {
            folder: 'products',
            contentType: finalMime,
            isPublic: true,
          });

          imageEntries.push({
            url: result.url,
            alt: imageTypeToAlt(imgType, product.name),
            isPrimary: i === 0,
          });

          uploaded++;
          console.log(`  -> Uploaded: ${file}`);
        } catch (err: any) {
          failed++;
          console.error(`  X Failed: ${file} - ${err.message}`);
        }
      }

      if (imageEntries.length > 0) {
        await Product.findByIdAndUpdate(product._id, {
          $set: { images: imageEntries },
        });
        console.log(`  => Updated product with ${imageEntries.length} images`);
      }
    }
  }

  console.log('\n\n=== Summary ===');
  console.log(`Total image groups: ${Object.keys(groups).length}`);
  console.log(`Matched to products: ${matched}`);
  console.log(`Unmatched: ${unmatched}`);

  if (!DRY_RUN) {
    console.log(`Images uploaded: ${uploaded}`);
    console.log(`Images failed: ${failed}`);
  }

  if (unmatchedGroups.length > 0) {
    console.log('\nUnmatched groups:');
    unmatchedGroups.forEach(g => console.log(g));
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
