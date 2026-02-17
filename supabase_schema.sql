
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

-- Course Modules
create table if not exists public.course_modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  duration text,
  "order" integer default 0
);

-- Users (Custom table for institutional profiles)
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

-- Instructors
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

-- Admissions
create table if not exists public.admission_forms (
  id uuid primary key default uuid_generate_v4(),
  reg_number text,
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

-- Exam Results
create table if not exists public.exam_results (
  id uuid primary key default uuid_generate_v4(),
  student_id text not null, -- matches reg_number
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

-- Attendance
create table if not exists public.attendance_records (
  id uuid primary key default uuid_generate_v4(),
  student_id text not null,
  course_id uuid references public.courses(id),
  date date not null,
  status text check (status in ('Present', 'Absent', 'Late', 'Excused')),
  join_time text,
  duration_minutes integer,
  remarks text
);

-- Schedules
create table if not exists public.session_schedules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id),
  topic text not null,
  start_time timestamp with time zone not null,
  status text check (status in ('Scheduled', 'Live', 'Completed'))
);

-- News Alerts
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

-- Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price text,
  image text,
  slogan text,
  description text,
  created_at timestamp with time zone default now()
);

-- Quizzes
create table if not exists public.quizzes (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null
);

-- Quiz Questions
create table if not exists public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  question text not null,
  options text[] not null,
  correct_index integer not null
);

-- User Progress
create table if not exists public.user_progress (
  user_id uuid references public.users_table(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  completed_module_ids uuid[] default '{}',
  quiz_scores jsonb default '[]',
  primary key (user_id, course_id)
);

-- Discussions
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

-- 3. STORAGE BUCKETS SETUP
-- Using the specified bucket: "web data"
-- Ensure this bucket exists in your Supabase dashboard

-- Policies for "web data" bucket
create policy "Public Read 'web data'" on storage.objects for select using ( bucket_id = 'web data' );
create policy "Public Insert 'web data'" on storage.objects for insert with check ( bucket_id = 'web data' );

-- 4. INITIAL DATA SEEDING
insert into public.courses (name, thumbnail, instructor_name, instructor_image, content, description, duration, status, mode)
values 
('Fashion Designing', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e', 'Sarah Ahmed', 'https://picsum.photos/seed/sarah/100/100', 'Pattern Making, Textile Arts, Tailoring', 'Master the art of garment construction and design from scratch.', '6 Months', 'Active', 'ON CAMPUS'),
('Digital Marketing', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 'Zainab Bibi', 'https://picsum.photos/seed/zainab/100/100', 'SEO, Social Media, Content Creation', 'Learn to build a digital presence and grow businesses online.', '3 Months', 'Active', 'ONLINE');

insert into public.users_table (username, password, role, points, badges)
values 
('admin', 'password123', 'admin', 500, '{"Elite"}'),
('student', 'password123', 'student', 150, '{"First Steps"}');

insert into public.news_alerts (category, title, content, action_text, action_page, expires_at, priority)
values 
('Admission', 'Admissions Open!', 'Fall 2024 Batch enrollment has started.', 'Apply Now', 'admissions', now() + interval '30 days', 'High');

insert into public.products (name, price, image, slogan, description)
values 
('Bridal Gown - Royal Crimson', '45,000 PKR', 'https://images.unsplash.com/photo-1594552072238-b8a33785b261', 'Elegance for your special day.', 'Hand-embroidered bridal wear.');

-- RLS Enablement (Basic access)
alter table public.courses enable row level security;
alter table public.users_table enable row level security;
alter table public.admission_forms enable row level security;

create policy "Public read access for all" on public.courses for select using (true);
create policy "Public read access for all users" on public.users_table for select using (true);
create policy "Public read access for admissions" on public.admission_forms for select using (true);
create policy "Public insert for admissions" on public.admission_forms for insert with check (true);
