const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config({
  path: [path.join(__dirname, "../.env.local"), path.join(__dirname, "../.env")],
});

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing environment variables: "NEXT_PUBLIC_SUPABASE_URL" and/or "SUPABASE_SERVICE_ROLE_KEY"'
  );
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Override via env or CLI: node scripts/seed-admin-user.js email password
const email = process.argv[2] || process.env.ADMIN_EMAIL || "admin@bhutan-tourism.com";
const password = process.argv[3] || process.env.ADMIN_PASSWORD || "admin123";

async function seed() {
  console.log("Seeding admin user...");

  const { data: existing, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw listError;

  if (existing.users.some((u) => (u.email ?? "").toLowerCase() === email.toLowerCase())) {
    console.log("Admin user already exists. Skipping...");
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username: "admin" },
    app_metadata: { role: "admin" },
  });
  if (error) throw error;

  console.log(`Successfully created admin user with ID: ${data.user.id}`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password} (please change this after first login)`);
}

seed().catch((error) => {
  console.error("Error seeding admin user:", error);
  process.exitCode = 1;
});
