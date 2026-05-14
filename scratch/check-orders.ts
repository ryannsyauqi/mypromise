import { createAdminClient } from "../src/utils/supabase/admin";

async function checkOrders() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select('order_number, payment_status, buyer_name')
    .limit(5);

  if (error) {
    console.error("Error fetching orders:", error);
    return;
  }

  console.log("Existing Orders:");
  console.table(data);
}

checkOrders();
