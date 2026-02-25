
-- ==========================================================
-- AKBAR KHAN TECHNICAL AND VOCATIONAL INSTITUTE (AKTVI)
-- COMPLETE DATABASE SCHEMA (AUTO-INCREMENT INTEGER IDs)
-- ==========================================================

-- 1. COURSES (Curriculum Registry)
CREATE TABLE IF NOT EXISTS public.courses (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    thumbnail TEXT,
    instructor_name TEXT,
    instructor_image TEXT,
    content TEXT,
    description TEXT,
    duration TEXT,
    status TEXT CHECK (status IN ('Active', 'Pending', 'Scheduled', 'Postponed')) DEFAULT 'Active',
    mode TEXT CHECK (mode IN ('ON CAMPUS', 'ONLINE')) DEFAULT 'ON CAMPUS',
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADMISSION FORMS (Inbound Applications)
CREATE TABLE IF NOT EXISTS public.admission_forms (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    cnic TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female')) DEFAULT 'Female',
    qualification TEXT,
    occupation TEXT,
    guardian_name TEXT,
    whatsapp TEXT,
    guardian_whatsapp TEXT,
    relation TEXT,
    address TEXT,
    email TEXT,
    course_id BIGINT REFERENCES public.courses(id) ON DELETE SET NULL,
    photo TEXT,
    status TEXT CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    is_draft BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ADMISSION WITHDRAWAL (Permanent Student Register)
CREATE TABLE IF NOT EXISTS public.admission_withdrawal (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    admission_id BIGINT REFERENCES public.admission_forms(id) ON DELETE SET NULL,
    enrollment_serial SERIAL, 
    reg_number TEXT UNIQUE,   
    student_name TEXT NOT NULL,
    cnic TEXT NOT NULL,
    course_id BIGINT REFERENCES public.courses(id) ON DELETE SET NULL,
    admission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    withdrawal_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Approved', 'Suspended', 'Active', 'Certified', 'Rusticated')),
    remarks TEXT
);

-- 4. REGISTRATION NUMBER GENERATION TRIGGER
CREATE OR REPLACE FUNCTION public.generate_reg_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reg_number := 'AKTVI/' || LPAD(NEW.enrollment_serial::TEXT, 4, '0') || '/' || EXTRACT(YEAR FROM NEW.admission_date)::TEXT;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_generate_reg_number
BEFORE INSERT ON public.admission_withdrawal
FOR EACH ROW EXECUTE FUNCTION public.generate_reg_number();

-- 5. USERS TABLE (LMS Access)
CREATE TABLE IF NOT EXISTS public.users_table (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    password TEXT NOT NULL, 
    dob DATE,
    role TEXT CHECK (role IN ('admin', 'student', 'instructor')) DEFAULT 'student',
    email TEXT,
    reg_number TEXT,
    points INTEGER DEFAULT 0,
    badges TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FACULTY (Instructors)
CREATE TABLE IF NOT EXISTS public.instructors (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT REFERENCES public.users_table(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    qualification TEXT,
    subject TEXT,
    class_assignment TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. EXAM RESULTS (Student Performance)
CREATE TABLE IF NOT EXISTS public.exam_results (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id TEXT NOT NULL,
    exam_type TEXT CHECK (exam_type IN ('1st Term', '2nd Term', 'Final Exam', 'Board Exam')),
    paper_total INTEGER DEFAULT 100,
    paper_obtained INTEGER DEFAULT 0,
    practical_total INTEGER DEFAULT 50,
    practical_obtained INTEGER DEFAULT 0,
    assignment_total INTEGER DEFAULT 25,
    assignment_obtained INTEGER DEFAULT 0,
    position TEXT,
    remarks TEXT,
    date_published TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. SESSION SCHEDULES (LMS Live/Future Classes)
CREATE TABLE IF NOT EXISTS public.session_schedules (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('Scheduled', 'Live', 'Completed')) DEFAULT 'Scheduled'
);

-- 9. ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id TEXT NOT NULL,
    course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    remarks TEXT
);

-- 10. NEWS ALERTS
CREATE TABLE IF NOT EXISTS public.news_alerts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category TEXT CHECK (category IN ('Admission', 'Result', 'Schedule', 'Urgent')),
    title TEXT NOT NULL,
    content TEXT,
    action_text TEXT,
    action_page TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    priority TEXT CHECK (priority IN ('Normal', 'High')) DEFAULT 'Normal'
);

-- 11. PRODUCTS (Institutional Sales)
CREATE TABLE IF NOT EXISTS public.products (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    price TEXT,
    image TEXT,
    slogan TEXT,
    description TEXT,
    stock_status TEXT DEFAULT 'Available',
    is_featured BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'Casual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. LMS: QUIZZES
CREATE TABLE IF NOT EXISTS public.quizzes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. LMS: DISCUSSION FORUM
CREATE TABLE IF NOT EXISTS public.discussion_posts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES public.users_table(id),
    user_name TEXT,
    user_role TEXT,
    title TEXT NOT NULL,
    content TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- DUMMY DATA INJECTION
-- ==========================================================

INSERT INTO public.courses (name, thumbnail, instructor_name, instructor_image, duration, status, mode, description)
VALUES 
('Fashion Designing & Apparel', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e', 'Ms. Sarah Khan', 'https://picsum.photos/seed/sarah/200/200', '6 Months', 'Active', 'ON CAMPUS', 'Comprehensive course covering pattern making and bridal wear.'),
('Digital Marketing Mastery', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 'Mr. Ishtiaq Ali', 'https://picsum.photos/seed/ishtiaq/200/200', '3 Months', 'Active', 'ONLINE', 'Learn SEO, SMM, and professional content strategy.');

INSERT INTO public.users_table (username, first_name, last_name, password, dob, role, email)
VALUES 
('admin_akbar', 'Hamza', 'Bacha', 'admin123', '1995-01-01', 'admin', 'admin@aktvi.edu.pk'),
('sarah_instructor', 'Sarah', 'Khan', 'pass123', '1990-05-15', 'instructor', 'sarah@aktvi.edu.pk');

INSERT INTO public.instructors (user_id, name, qualification, subject, class_assignment, image)
VALUES (2, 'Ms. Sarah Khan', 'M.Phil in Textile Design', 'Fashion Designing', 'Batch A-2024', 'https://picsum.photos/seed/sarah/200/200');

INSERT INTO public.admission_forms (first_name, last_name, cnic, dob, gender, whatsapp, course_id, status)
VALUES ('Fatima', 'Zahra', '16101-1234567-1', '2005-02-14', 'Female', '+923155241325', 1, 'Pending');

INSERT INTO public.admission_withdrawal (student_name, cnic, course_id, status)
VALUES ('Zoya Ahmed', '16101-9999999-9', 1, 'Active');

INSERT INTO public.exam_results (student_id, exam_type, paper_obtained, practical_obtained, remarks)
VALUES ('AKTVI/0001/2024', '1st Term', 85, 45, 'Excellent performance.');

INSERT INTO public.session_schedules (course_id, topic, start_time, status)
VALUES (1, 'Introduction to Pattern Making', NOW() + INTERVAL '1 day', 'Scheduled');
