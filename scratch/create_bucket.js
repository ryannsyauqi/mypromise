const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iitfelcuvzdehzkxnjrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdGZlbGN1dnpkZWh6a3huanJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODIzMjQyNCwiZXhwIjoyMDkzODA4NDI0fQ.Y6Sw_lObVltYeS8hWqOvcjkLWkMRQ4QccIZtXsg5W1U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }

  const bucketName = 'invitations';
  const bucketExists = buckets?.find((b) => b.name === bucketName);

  if (!bucketExists) {
    console.log(`Bucket '${bucketName}' does not exist. Creating...`);
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/*'],
    });

    if (createError) {
      console.error('Error creating bucket:', createError);
    } else {
      console.log(`Bucket '${bucketName}' created successfully.`);
    }
  } else {
    console.log(`Bucket '${bucketName}' already exists.`);
  }
}

checkAndCreateBucket();
