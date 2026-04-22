
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.booking_type AS ENUM ('online', 'intern');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'cancelled', 'refunded');
CREATE TYPE public.room_status AS ENUM ('aktiv', 'wartung', 'inaktiv');

-- ============ UPDATED_AT TRIGGER FUNCTION ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ ROOMS ============
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number INT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  bed_description TEXT NOT NULL,
  max_persons INT NOT NULL DEFAULT 2,
  price_per_night NUMERIC(10,2) NOT NULL,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  status room_status NOT NULL DEFAULT 'aktiv',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Admins manage rooms" ON public.rooms FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_rooms_updated BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ EXTRAS ============
CREATE TABLE public.extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  per_night BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view extras" ON public.extras FOR SELECT USING (true);
CREATE POLICY "Admins manage extras" ON public.extras FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ GUESTS ============
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create guests" ON public.guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view guests" ON public.guests FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update guests" ON public.guests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete guests" ON public.guests FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_guests_updated BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ BOOKINGS ============
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT NOT NULL UNIQUE DEFAULT ('LHS-' || to_char(now(), 'YYMMDD') || '-' || lpad(floor(random()*10000)::text, 4, '0')),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  extras JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  booking_type booking_type NOT NULL DEFAULT 'online',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bookings_dates_check CHECK (check_out > check_in)
);
CREATE INDEX idx_bookings_room ON public.bookings(room_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update bookings" ON public.bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete bookings" ON public.bookings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AVAILABILITY HELPER (public for booking page) ============
CREATE OR REPLACE FUNCTION public.get_room_availability(_check_in DATE, _check_out DATE)
RETURNS TABLE(room_id UUID, is_available BOOLEAN)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id AS room_id,
    NOT EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.room_id = r.id
        AND b.payment_status <> 'cancelled'
        AND b.check_in < _check_out
        AND b.check_out > _check_in
    ) AS is_available
  FROM public.rooms r
  WHERE r.status = 'aktiv';
$$;

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public) VALUES ('room-photos', 'room-photos', true);

CREATE POLICY "Public read room photos" ON storage.objects FOR SELECT USING (bucket_id = 'room-photos');
CREATE POLICY "Admins upload room photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'room-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update room photos" ON storage.objects FOR UPDATE USING (bucket_id = 'room-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete room photos" ON storage.objects FOR DELETE USING (bucket_id = 'room-photos' AND public.has_role(auth.uid(), 'admin'));
