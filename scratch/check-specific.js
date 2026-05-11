const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://iitfelcuvzdehzkxnjrp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdGZlbGN1dnpkZWh6a3huanJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODIzMjQyNCwiZXhwIjoyMDkzODA4NDI0fQ.Y6Sw_lObVltYeS8hWqOvcjkLWkMRQ4QccIZtXsg5W1U"
);

async function check() {
  const targetId = "3e996748-cc18-4928-8bd4-ab29574dcbca";
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number')
    .eq('id', targetId)
    .single();
  
  if (error) console.error("Error finding order:", error);
  else console.log("Order found:", data);

  const { data: inv, error: invError } = await supabase
    .from('invitations')
    .select('id, order_id')
    .eq('order_id', targetId)
    .single();
  
  if (invError) console.error("Error finding invitation:", invError);
  else console.log("Invitation found:", inv);
}

check();
