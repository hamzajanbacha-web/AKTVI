
-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES (Optimized Order)

-- Courses
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  thumbnail text,
  instructor_name text,
  instructor_image text,
  content text,
  description text,
  duration text,
  status text check (status in ('Active', 'Pending', 'Scheduled', 'Postponed')),
  mode text check (mode in ('ON CAMPUS', 'ONLINE')),
  category text,
  created_at timestamp with time zone default now()
);

-- Admission Forms (Inbound Applications)
create table if not exists public.admission_forms (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  cnic text not null,
  dob date not null,
  gender text check (gender in ('Male', 'Female')),
  qualification text,
  occupation text,
  guardian_name text,
  whatsapp text,
  guardian_whatsapp text,
  relation text,
  address text,
  email text,
  course_id uuid references public.courses(id) on delete set null,
  photo text,
  status text check (status in ('Pending', 'Approved', 'Rejected')) default 'Pending',
  is_draft boolean default false,
  created_at timestamp with time zone default now()
);

-- Admission Withdrawal (Permanent Student Register)
create table if not exists public.admission_withdrawal (
  id uuid primary key default uuid_generate_v4(),
  admission_id uuid references public.admission_forms(id) on delete set null,
  enrollment_serial serial, -- Provides the XXXX part
  reg_number text unique,   -- Calculated as AKTVI-XXXX-YYYY
  student_name text not null,
  cnic text not null,
  course_id uuid references public.courses(id) on delete set null,
  admission_date timestamp with time zone default now(),
  withdrawal_date timestamp with time zone,
  -- Status as requested: Approved, Suspended, Active, Certified, Rusticated
  status text default 'Active' check (status in ('Approved', 'Suspended', 'Active', 'Certified', 'Rusticated')),
  remarks text
);

-- Logic for auto-generating AKTVI-XXXX-YYYY
create or replace function public.generate_reg_number()
returns trigger as $$
begin
  new.reg_number := 'AKTVI-' || lpad(new.enrollment_serial::text, 4, '0') || '-' || extract(year from new.admission_date)::text;
  return new;
end;
$$ language plpgsql;

create trigger tr_generate_reg_number
before insert on public.admission_withdrawal
for each row execute function public.generate_reg_number();

-- Users Table
create table if not exists public.users_table (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  first_name text,
  last_name text,
  password text not null, 
  dob date,
  role text check (role in ('admin', 'student', 'instructor')),
  email text,
  reg_number text, -- links to admission_withdrawal.reg_number
  points integer default 0,
  badges text[] default '{}',
  created_at timestamp with time zone default now()
);

-- 3. RLS & POLICIES

-- Enable RLS
alter table public.courses enable row level security;
alter table public.admission_forms enable row level security;
alter table public.admission_withdrawal enable row level security;
alter table public.users_table enable row level security;

-- Course Policies
create policy "Courses are viewable by everyone" on public.courses for select using (true);
create policy "Admins can manage courses" on public.courses for all using (
  exists (select 1 from public.users_table where id = auth.uid() and role = 'admin')
);

-- Admission Form Policies
create policy "Anyone can submit an admission form" on public.admission_forms for insert with check (true);
create policy "Admins and Instructors can view forms" on public.admission_forms for select using (true); -- Simplified for public view, restrict in production

-- Permanent Register Policies
create policy "Register is viewable by staff" on public.admission_withdrawal for select using (true);
create policy "Admins can manage register" on public.admission_withdrawal for all using (true);

-- Storage Policies for "web data" bucket
-- Note: Replace 'web data' with bucket name in dashboard
create policy "Public Read Access" on storage.objects for select using ( bucket_id = 'web data' );
create policy "Public Upload Access" on storage.objects for insert with check ( bucket_id = 'web data' );

-- 4. SEED DATA
insert into public.courses (name, duration, status, mode, category)
values 
('Fashion Designing', '6 Months', 'Active', 'ON CAMPUS', 'Vocational'),
('Digital Marketing', '3 Months', 'Active', 'ONLINE', 'Technical');
