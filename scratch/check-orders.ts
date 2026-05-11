import { createClient } from "./src/utils/supabase/server";

async function checkOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

checkOrders();
