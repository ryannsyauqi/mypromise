const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { error } = await supabase.rpc('run_sql', { 
    sql: "ALTER TABLE guests ADD COLUMN IF NOT EXISTS status text DEFAULT 'belum_konfirmasi', ADD COLUMN IF NOT EXISTS is_opened boolean DEFAULT false;" 
  });
  console.log(error);
}
run();
