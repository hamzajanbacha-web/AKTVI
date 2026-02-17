
import { createClient } from '@supabase/supabase-js';

// Credentials provided for the institution's Supabase project
const supabaseUrl = 'https://laccbdadycmuzqoimzqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY2NiZGFkeWNtdXpxb2ltenFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjg0MzksImV4cCI6MjA4NjkwNDQzOX0.KjWH4w_F6KBr-CouJHqkgWvVnuRcVWNrSxXd0vgKytA';

/**
 * Initialize the Supabase client.
 * Using the provided project URL and the legacy anon key for institutional data access.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
