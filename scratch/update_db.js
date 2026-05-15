const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function addColumn() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: "ALTER TABLE invitations ADD COLUMN IF NOT EXISTS is_slug_customized BOOLEAN DEFAULT FALSE;"
  });
  if (error) console.error(error);
  else console.log("Column added successfully");
}
addColumn();
