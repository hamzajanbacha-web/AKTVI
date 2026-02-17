
-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

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

-- Admission Withdrawal Register (Enrolled Students)
create table if not exists public.admission_withdrawal (
  id uuid primary key default uuid_generate_v4(),
  admission_id uuid references public.admission_forms(id) on delete set null,
  enrollment_serial serial, -- Provides the XXXX part
  reg_number text unique,   -- Calculated as AKTVI-XXXX-YYYY
  student_name text not null,
  cnic text not null,
  course_id uuid references public.courses(id),
  admission_date timestamp with time zone default now(),
  withdrawal_date timestamp with time zone,
  status text default 'Enrolled' check (status in ('Enrolled', 'Withdrawn', 'Completed', 'Dropped')),
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

-- Admission Forms (Applications)
create table if not exists public.admission_forms (
  id uuid primary key default uuid_generate_v4(),
  reg_number text, -- Transient field for UI
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
  course_id uuid references public.courses(id),
  photo text,
  status text check (status in ('Pending', 'Approved', 'Rejected')) default 'Pending',
  is_draft boolean default false,
  created_at timestamp with time zone default now()
);

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
  reg_number text,
  points integer default 0,
  badges text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Other tables (instructors, exam_results, etc.) remain as defined previously...
-- Ensure the storage bucket "web data" is manually created in the Supabase Dashboard.

-- RLS Policies
alter table public.admission_forms enable row level security;
alter table public.admission_withdrawal enable row level security;
create policy "Public read access for admissions" on public.admission_forms for select using (true);
create policy "Public insert for admissions" on public.admission_forms for insert with check (true);
create policy "Public read for register" on public.admission_withdrawal for select using (true);
