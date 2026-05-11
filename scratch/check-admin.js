const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://iitfelcuvzdehzkxnjrp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdGZlbGN1dnpkZWh6a3huanJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODIzMjQyNCwiZXhwIjoyMDkzODA4NDI0fQ.Y6Sw_lObVltYeS8hWqOvcjkLWkMRQ4QccIZtXsg5W1U"
);

async function check() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

check();
