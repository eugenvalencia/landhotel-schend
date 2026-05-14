#!/usr/bin/env node
/**
 * One-off: create the demo admin user in a fresh Supabase project.
 * Reads DB URL from CLI arg, NEVER from a checked-in file.
 * Idempotent: re-runs are no-ops if the user already exists.
 *
 * Usage:
 *   node scripts/seed-admin.mjs "postgresql://postgres.REF:PW@host:5432/postgres"
 */
import pg from "pg";

const DB_URL = process.argv[2];
const EMAIL = "admin@landhotel-schend.de";
const PASSWORD = "Demo2026";

if (!DB_URL) {
  console.error("Missing DB URL arg.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: DB_URL });
await client.connect();

try {
  const existing = await client.query(
    "SELECT id FROM auth.users WHERE email = $1 LIMIT 1",
    [EMAIL],
  );

  let userId;
  if (existing.rows.length) {
    userId = existing.rows[0].id;
    console.log(`✓ Admin user already exists: ${userId}`);
  } else {
    const insertUser = await client.query(
      `
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, email_change,
        email_change_token_new, recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        $1,
        crypt($2, gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '', '', '', ''
      )
      RETURNING id
      `,
      [EMAIL, PASSWORD],
    );
    userId = insertUser.rows[0].id;
    console.log(`✓ Admin user created: ${userId}`);
  }

  // user_roles is the public table; on_auth_user_created trigger already made the profile
  const role = await client.query(
    `
    INSERT INTO public.user_roles (user_id, role)
    VALUES ($1, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING
    RETURNING id
    `,
    [userId],
  );
  if (role.rows.length) {
    console.log(`✓ Admin role granted: ${role.rows[0].id}`);
  } else {
    console.log(`✓ Admin role already present`);
  }

  // sanity: profile auto-created by trigger?
  const profile = await client.query(
    "SELECT id, email, display_name FROM public.profiles WHERE user_id = $1",
    [userId],
  );
  console.log(`✓ Profile row: ${profile.rows.length ? JSON.stringify(profile.rows[0]) : "MISSING"}`);
} finally {
  await client.end();
}
