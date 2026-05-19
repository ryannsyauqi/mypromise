const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const newTemplates = [
  // Elegant Series
  {
    name: 'Aurel',
    slug: 'aurel',
    category: 'Elegant Series',
    description: 'Template undangan pernikahan modern yang sangat bersih, minimalis, dan berfokus pada keindahan foto prewedding pasangan.',
    price: 119000,
    original_price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: '/images/templates/aurel-v7.png',
    demo_url: '/demo/aurel'
  },
  {
    name: 'Celeste',
    slug: 'celeste',
    category: 'Elegant Series',
    description: 'Desain undangan bertema editorial majalah premium dengan pembatas garis emas tipis dan layout foto bergaya melingkar yang anggun.',
    price: 119000,
    original_price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: '/images/templates/celeste-v2.png',
    demo_url: '/demo/celeste'
  },
  {
    name: 'Mirelle',
    slug: 'mirelle',
    category: 'Elegant Series',
    description: 'Sentuhan klasik modern dengan layout dua kolom yang elegan dan ornamen line-art floral halus bergaya majalah pernikahan Vogue.',
    price: 119000,
    original_price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: '/images/templates/mirelle-v2.png',
    demo_url: '/demo/mirelle'
  },
  // Nusantara Series
  {
    name: 'Saka',
    slug: 'saka',
    category: 'Nusantara Series',
    description: 'Perpaduan aksen budaya Jawa tradisional yang disederhanakan secara geometris modern dengan latar belakang earth-tone yang mewah.',
    price: 119000,
    original_price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: '/images/templates/saka-v2.png',
    demo_url: '/demo/saka'
  },
  {
    name: 'Tirta',
    slug: 'tirta',
    category: 'Nusantara Series',
    description: 'Desain kontemporer yang terinspirasi dari keindahan motif tenun ikat dan aliran air dengan perpaduan warna teal & terracotta.',
    price: 119000,
    original_price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: '/images/templates/tirta-v2.png',
    demo_url: '/demo/tirta'
  },
  {
    name: 'Wulan',
    slug: 'wulan',
    category: 'Nusantara Series',
    description: 'Nuansa Nusantara feminin yang lembut, menampilkan pola batik parang diagonal halus dengan perpaduan warna rose gold dan krem.',
    price: 119000,
    original_price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: '/images/templates/wulan-v2.png',
    demo_url: '/demo/wulan'
  },
  // Floral Series
  {
    name: 'Jasmine',
    slug: 'jasmine',
    category: 'Floral Series',
    description: 'Desain bernuansa cerah dan romantis dengan ilustrasi cat air bunga melati dan dedaunan sage green yang segar dan cantik.',
    price: 119000,
    original_price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: '/images/templates/jasmine-v2.png',
    demo_url: '/demo/jasmine'
  },
  {
    name: 'Fern',
    slug: 'fern',
    category: 'Floral Series',
    description: 'Estetika eco-luxury bernuansa dedaunan hijau sage yang asimetris, natural, dan bertekstur kertas daur ulang organik.',
    price: 119000,
    original_price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: '/images/templates/fern-v2.png',
    demo_url: '/demo/fern'
  },
  {
    name: 'Dahlia',
    slug: 'dahlia',
    category: 'Floral Series',
    description: 'Floral bertema gelap (moody dark) yang dramatis, memadukan background hijau hutan pekat dengan bunga krem keemasan.',
    price: 119000,
    original_price: 199000,
    is_active: true,
    field_schema: [],
    thumbnail_url: '/images/templates/dahlia-v2.png',
    demo_url: '/demo/dahlia'
  }
];

async function seed() {
  console.log('Memulai seeding templates baru...');
  const { data, error } = await supabase
    .from('templates')
    .upsert(newTemplates, { onConflict: 'slug' })
    .select('slug, name');

  if (error) {
    console.error('Error saat seeding:', error);
    process.exit(1);
  }

  console.log('Seeding berhasil! Template terdaftar:', data);
}

seed();
