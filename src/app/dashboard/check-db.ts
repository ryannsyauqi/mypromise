
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! || process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTable() {
  const { data, error } = await supabase.from('invitations').select('count').limit(1);
  if (error) {
    console.log("❌ Table 'invitations' error:", error.message);
  } else {
    console.log("✅ Table 'invitations' exists.");
  }
  
  const { data: orderData, error: orderError } = await supabase.from('orders').select('id, notes, expires_at').limit(1);
  if (orderError) {
    console.log("❌ Table 'orders' error:", orderError.message);
  } else {
    console.log("✅ Table 'orders' exists.");
  }
}

checkTable();
