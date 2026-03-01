import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing env vars. Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// ---------------------------------------------------------------------------
// Types matching the seed JSON structure
// ---------------------------------------------------------------------------

interface SeedProduct {
  name: string;
  price_cents: number;
  sort_order: number;
}

interface SeedCategory {
  name: string;
  sort_order: number;
  children?: SeedCategory[];
  products?: SeedProduct[];
}

interface SeedSeller {
  name: string;
  pin: string;
}

interface SeedEvent {
  name: string;
  starts_at: string;
  ends_at: string;
  active: boolean;
}

interface SeedData {
  sellers: SeedSeller[];
  events: SeedEvent[];
  categories: SeedCategory[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function insertSellers(sellers: SeedSeller[]): Promise<void> {
  const rows = sellers.map((s) => ({ name: s.name, pin: s.pin }));
  const { error } = await supabase.from('sellers').insert(rows);
  if (error) throw new Error(`Failed to insert sellers: ${error.message}`);
  console.log(`  Inserted ${sellers.length} seller(s)`);
}

async function insertEvents(events: SeedEvent[]): Promise<void> {
  const rows = events.map((e) => ({
    name: e.name,
    starts_at: e.starts_at,
    ends_at: e.ends_at,
    active: e.active,
  }));
  const { error } = await supabase.from('events').insert(rows);
  if (error) throw new Error(`Failed to insert events: ${error.message}`);
  console.log(`  Inserted ${events.length} event(s)`);
}

async function insertCategory(
  cat: SeedCategory,
  parentId: string | null,
): Promise<void> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: cat.name,
      parent_id: parentId,
      sort_order: cat.sort_order,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to insert category "${cat.name}": ${error?.message}`,
    );
  }

  const categoryId: string = data.id;
  console.log(
    `  Category "${cat.name}" (parent=${parentId ?? 'root'}) -> ${categoryId}`,
  );

  // Insert child categories recursively
  if (cat.children) {
    for (const child of cat.children) {
      await insertCategory(child, categoryId);
    }
  }

  // Insert products under this category
  if (cat.products) {
    const productRows = cat.products.map((p) => ({
      category_id: categoryId,
      name: p.name,
      price_cents: p.price_cents,
      active: true,
      sort_order: p.sort_order,
    }));

    const { error: prodError } = await supabase
      .from('products')
      .insert(productRows);
    if (prodError) {
      throw new Error(
        `Failed to insert products for "${cat.name}": ${prodError.message}`,
      );
    }
    console.log(`    ${productRows.length} product(s) under "${cat.name}"`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const seedPath = resolve(
    __dirname,
    '..',
    'src',
    'data',
    'products.seed.json',
  );
  const raw = readFileSync(seedPath, 'utf-8');
  const seed: SeedData = JSON.parse(raw);

  console.log('Seeding database...\n');

  // 1. Sellers
  console.log('Sellers:');
  await insertSellers(seed.sellers);

  // 2. Events
  console.log('\nEvents:');
  await insertEvents(seed.events);

  // 3. Categories + Products (recursive)
  console.log('\nCategories & Products:');
  for (const cat of seed.categories) {
    await insertCategory(cat, null);
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
