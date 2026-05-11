const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://iitfelcuvzdehzkxnjrp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdGZlbGN1dnpkZWh6a3huanJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODIzMjQyNCwiZXhwIjoyMDkzODA4NDI0fQ.Y6Sw_lObVltYeS8hWqOvcjkLWkMRQ4QccIZtXsg5W1U"
);

async function check() {
  const { data, error } = await supabase.from('invitations').select('count').limit(1);
  if (error) console.log("invitations error:", error.message);
  else console.log("invitations ok");

  const { data: d2, error: e2 } = await supabase.from('order_content').select('count').limit(1);
  if (e2) console.log("order_content error:", e2.message);
  else console.log("order_content ok");
}

check();
