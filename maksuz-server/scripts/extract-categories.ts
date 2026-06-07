/**
 * Extract unique categories from WooCommerce CSV
 * Usage: npx ts-node scripts/extract-categories.ts wordpress-woocomerce-med.csv
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const csvPath = process.argv[2] || 'wordpress-woocomerce-med.csv';
const fullPath = path.resolve(csvPath);

if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`);
  process.exit(1);
}

const content = fs.readFileSync(fullPath, 'utf-8');

const records = parse(content, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  quote: '"',
  escape: '"',
});

// Extract all unique category paths
const categorySet = new Set<string>();

for (const row of records as Record<string, string>[]) {
  const categories = row['Kategorije'];
  if (categories) {
    // Split by comma (but handle "Med, Med > Prirodni med" format)
    const paths = categories.split(',').map((c: string) => c.trim()).filter(Boolean);
    for (const p of paths) {
      if (p && !p.includes('"') && p.length > 1) {
        categorySet.add(p);
      }
    }
  }
}

// Parse into hierarchy
interface CategoryNode {
  name: string;
  children: Map<string, CategoryNode>;
  count: number;
}

const root: CategoryNode = { name: 'Root', children: new Map(), count: 0 };

for (const categoryPath of categorySet) {
  const parts = categoryPath.split(' > ').map(p => p.trim()).filter(Boolean);
  
  let current = root;
  for (const part of parts) {
    if (!current.children.has(part)) {
      current.children.set(part, { name: part, children: new Map(), count: 0 });
    }
    current = current.children.get(part)!;
    current.count++;
  }
}

// Print hierarchy
function printTree(node: CategoryNode, level: number = 0, prefix: string = '') {
  const indent = '  '.repeat(level);
  const icon = level === 0 ? '📁' : level === 1 ? '📂' : '📄';
  
  if (level > 0) {
    console.log(`${indent}${icon} ${node.name}`);
  }
  
  const children = Array.from(node.children.values()).sort((a, b) => a.name.localeCompare(b.name, 'bs'));
  for (const child of children) {
    printTree(child, level + 1);
  }
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log('📊 Category Structure from WooCommerce CSV');
console.log('═══════════════════════════════════════════════════════════\n');

printTree(root);

// Also print as flat list
console.log('\n═══════════════════════════════════════════════════════════');
console.log('📋 Full Category Paths');
console.log('═══════════════════════════════════════════════════════════\n');

const sortedPaths = Array.from(categorySet).sort((a, b) => a.localeCompare(b, 'bs'));
for (const p of sortedPaths) {
  console.log(`  - ${p}`);
}

console.log(`\n✅ Total unique category paths: ${categorySet.size}`);

