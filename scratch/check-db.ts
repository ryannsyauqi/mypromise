import { createAdminClient } from "./src/utils/supabase/admin";

async function check() {
  const supabase = createAdminClient();
  
  console.log("Checking tables...");
  
  const { data: templates, error: tErr } = await supabase.from('templates').select('id, name, slug');
  console.log("Templates:", templates?.length || 0, tErr || "");
  
  const { data: orders, error: oErr } = await supabase.from('orders').select('id, order_number');
  console.log("Orders:", orders?.length || 0, oErr || "");
  
  const { data: invitations, error: iErr } = await supabase.from('invitations').select('id, order_id, slug');
  console.log("Invitations:", invitations?.length || 0, iErr || "");
  
  if (invitations) {
      console.log("Sample Invitation:", invitations[0]);
  }
}

check();
