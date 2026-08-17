-- ---------------------------------------------------------------------------
-- LOCAL DEVELOPMENT SEED
--
-- Runs only on `supabase db reset` against the local Docker stack. It is NOT
-- executed by `supabase db push`, so it never reaches a hosted project.
--
-- The account below uses a deliberately trivial password so the app can be
-- opened quickly while developing. NEVER create these credentials on a real
-- deployment: provision the first real Owner/Admin through an invite instead
-- (see the staff invite flow), and delete this account if it ever appears in
-- a hosted database.
--
--   email:    admin@example.com
--   password: admin
--
-- The password is written straight into auth.users as a bcrypt hash, which
-- bypasses the minimum_password_length = 6 rule in config.toml. That rule is
-- enforced by the auth API on signup, not on sign-in, so a 5-character
-- password still authenticates normally.
-- ---------------------------------------------------------------------------
do $$
declare
  admin_uid uuid := '00000000-0000-0000-0000-000000000001';
  admin_email text := 'admin@example.com';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    admin_uid,
    'authenticated',
    'authenticated',
    admin_email,
    extensions.crypt('admin', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false,
    '',
    '',
    '',
    ''
  );

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    admin_uid,
    jsonb_build_object(
      'sub', admin_uid::text,
      'email', admin_email,
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    admin_uid::text,
    now(),
    now(),
    now()
  );

  insert into public.profiles (id, full_name, email, role, active)
  values (admin_uid, 'Local Admin', admin_email, 'owner_admin', true);
end $$;

-- Singleton business settings row, bootstrapped from the same defaults the
-- env config uses so the app shell has branding to render locally.
insert into public.business_settings (id, business_name, currency_code, locale, primary_color)
values (1, 'Pine X Logistics', 'ZAR', 'en-ZA', '#1d4ed8')
on conflict (id) do nothing;
