const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) console.error(error);
  else console.log(data);
}

check();
