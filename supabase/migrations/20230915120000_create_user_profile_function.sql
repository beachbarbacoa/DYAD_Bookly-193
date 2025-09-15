CREATE OR REPLACE FUNCTION create_user_with_profile(
  user_id UUID,
  user_email TEXT,
  user_role TEXT,
  first_name TEXT,
  last_name TEXT,
  organization_name TEXT
) RETURNS VOID AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, email, role)
  VALUES (user_id, user_email, user_role)
  ON CONFLICT (id) DO NOTHING;

  -- Insert into user_profiles table
  INSERT INTO public.user_profiles (id, email, first_name, last_name, organization_name)
  VALUES (user_id, user_email, first_name, last_name, organization_name)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    organization_name = EXCLUDED.organization_name;
END;
$$ LANGUAGE plpgsql;