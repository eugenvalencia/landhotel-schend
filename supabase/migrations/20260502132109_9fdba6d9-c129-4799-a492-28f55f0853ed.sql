
CREATE OR REPLACE FUNCTION public.get_booked_ranges()
RETURNS TABLE(room_id uuid, check_in date, check_out date)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT b.room_id, b.check_in, b.check_out
  FROM public.bookings b
  WHERE b.payment_status <> 'cancelled'
    AND b.check_out >= CURRENT_DATE;
$$;
