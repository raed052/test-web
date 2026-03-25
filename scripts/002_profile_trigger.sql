-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', null)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to reset daily usage counts (run via cron job or scheduled task)
CREATE OR REPLACE FUNCTION public.reset_daily_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET daily_usage_count = 0, last_usage_date = CURRENT_DATE
  WHERE last_usage_date < CURRENT_DATE OR last_usage_date IS NULL;
END;
$$;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_usage(p_user_id UUID)
RETURNS TABLE(can_proceed BOOLEAN, current_count INT, max_allowed INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tier TEXT;
  v_count INT;
  v_max INT;
  v_last_date DATE;
BEGIN
  -- Get user's current tier and usage
  SELECT subscription_tier, daily_usage_count, last_usage_date
  INTO v_tier, v_count, v_last_date
  FROM public.profiles
  WHERE id = p_user_id;

  -- Reset count if it's a new day
  IF v_last_date IS NULL OR v_last_date < CURRENT_DATE THEN
    v_count := 0;
  END IF;

  -- Determine max allowed based on tier
  v_max := CASE v_tier
    WHEN 'free' THEN 2
    WHEN 'weekly' THEN 1000
    WHEN 'monthly' THEN 1000
    WHEN 'yearly' THEN 1000
    ELSE 2
  END;

  -- Check if user can proceed
  IF v_count < v_max THEN
    -- Increment count
    UPDATE public.profiles
    SET daily_usage_count = v_count + 1,
        last_usage_date = CURRENT_DATE
    WHERE id = p_user_id;
    
    RETURN QUERY SELECT true, v_count + 1, v_max;
  ELSE
    RETURN QUERY SELECT false, v_count, v_max;
  END IF;
END;
$$;
