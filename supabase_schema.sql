
-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES (Ordered by dependency)

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

-- Admission Forms (Initial Applications)
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

-- Admission Withdrawal (The Permanent Student Register)
create table if not exists public.admission_withdrawal (
  id uuid primary key default uuid_generate_v4(),
  admission_id uuid references public.admission_forms(id) on delete set null,
  enrollment_serial serial, 
  reg_number text unique,   
  student_name text not null,
  cnic text not null,
  course_id uuid references public.courses(id) on delete set null,
  admission_date timestamp with time zone default now(),
  withdrawal_date timestamp with time zone,
  -- Status: Approved, Suspended, Active, Certified, Rusticated
  status text default 'Active' check (status in ('Approved', 'Suspended', 'Active', 'Certified', 'Rusticated')),
  remarks text
);

-- Function for auto-generating AKTVI-XXXX-YYYY
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
  role text check (role in ('admin', 'student', 'instructor')) default 'student',
  email text,
  reg_number text, -- Matches admission_withdrawal.reg_number
  points integer default 0,
  badges text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Faculty
create table if not exists public.instructors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users_table(id) on delete cascade,
  name text not null,
  qualification text,
  subject text,
  class_assignment text,
  image text,
  created_at timestamp with time zone default now()
);

-- Academic Performance
create table if not exists public.exam_results (
  id uuid primary key default uuid_generate_v4(),
  student_id text not null, -- Can be Reg# or Admission ID
  exam_type text check (exam_type in ('1st Term', '2nd Term', 'Final Exam', 'Board Exam')),
  paper_total integer default 100,
  paper_obtained integer default 0,
  practical_total integer default 50,
  practical_obtained integer default 0,
  assignment_total integer default 25,
  assignment_obtained integer default 0,
  position text,
  remarks text,
  date_published timestamp with time zone default now()
);

-- Presence Tracking
create table if not exists public.attendance_records (
  id uuid primary key default uuid_generate_v4(),
  student_id text not null,
  course_id uuid references public.courses(id) on delete cascade,
  date date default current_date,
  status text check (status in ('Present', 'Absent', 'Late', 'Excused')),
  remarks text
);

-- Institutional Announcements
create table if not exists public.news_alerts (
  id uuid primary key default uuid_generate_v4(),
  category text check (category in ('Admission', 'Result', 'Schedule', 'Urgent')),
  title text not null,
  content text,
  action_text text,
  action_page text,
  expires_at timestamp with time zone,
  priority text check (priority in ('Normal', 'High'))
);

-- Sales Catalog
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price text,
  image text,
  slogan text,
  description text,
  created_at timestamp with time zone default now()
);

-- LMS: Quizzes
create table if not exists public.quizzes (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  created_at timestamp with time zone default now()
);

-- LMS: Quiz Questions
create table if not exists public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  question text not null,
  options text[] not null,
  correct_index integer not null
);

-- LMS: Discussion Forum
create table if not exists public.discussion_posts (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade,
  user_id uuid references public.users_table(id),
  user_name text,
  user_role text,
  title text not null,
  content text,
  timestamp timestamp with time zone default now()
);

create table if not exists public.discussion_replies (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.discussion_posts(id) on delete cascade,
  user_id uuid references public.users_table(id),
  user_name text,
  content text,
  timestamp timestamp with time zone default now()
);

-- 3. RLS POLICIES (Security Logic)

-- Enable RLS for all sensitive tables
alter table public.users_table enable row level security;
alter table public.admission_forms enable row level security;
alter table public.admission_withdrawal enable row level security;
alter table public.exam_results enable row level security;
alter table public.attendance_records enable row level security;

-- Public Access
create policy "Courses are public" on public.courses for select using (true);
create policy "Products are public" on public.products for select using (true);
create policy "News is public" on public.news_alerts for select using (true);

-- Allow selecting users for credentials verification (needed for login flow)
create policy "Public access to verify credentials" on public.users_table for select using (true);

-- Allow users to update their own credentials (password change)
create policy "Users can update their own data" on public.users_table for update using (true);

-- Admission Form: Anyone can submit, only staff can read
create policy "Public can submit forms" on public.admission_forms for insert with check (true);
create policy "Staff can view forms" on public.admission_forms for select using (
  exists (select 1 from public.users_table where id = auth.uid() and role in ('admin', 'instructor'))
);

-- Permanent Register: High security
create policy "Admins have full access to register" on public.admission_withdrawal for all using (
  exists (select 1 from public.users_table where id = auth.uid() and role = 'admin')
);
create policy "Students can view their own register status" on public.admission_withdrawal for select using (
  cnic = (select cnic from public.users_table where id = auth.uid())
);

-- Results: Only student and staff
create policy "Students can view their own results" on public.exam_results for select using (
  student_id = (select reg_number from public.users_table where id = auth.uid())
);
create policy "Staff can manage results" on public.exam_results for all using (
  exists (select 1 from public.users_table where id = auth.uid() and role in ('admin', 'instructor'))
);

-- Discussion: Participants of course can view
create policy "Course participants can view posts" on public.discussion_posts for select using (true);
create policy "Auth users can post" on public.discussion_posts for insert with check (auth.uid() is not null);

-- 4. SEED DATA

-- Default Admin User
insert into public.users_table (username, first_name, last_name, password, dob, role)
values ('admin', 'System', 'Administrator', 'admin123', '1990-01-01', 'admin')
on conflict (username) do nothing;

-- Sample Courses
insert into public.courses (name, duration, status, mode, category, description)
values 
('Fashion Designing', '6 Months', 'Active', 'ON CAMPUS', 'Vocational', 'Comprehensive fashion and tailoring program.'),
('Digital Marketing', '3 Months', 'Active', 'ONLINE', 'Technical', 'Modern marketing strategies and tools.');
