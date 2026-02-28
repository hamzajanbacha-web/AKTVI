
import { createClient } from '@supabase/supabase-js';

// Credentials provided for the institution's Supabase project
const supabaseUrl = 'https://laccbdadycmuzqoimzqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY2NiZGFkeWNtdXpxb2ltenFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjg0MzksImV4cCI6MjA4NjkwNDQzOX0.KjWH4w_F6KBr-CouJHqkgWvVnuRcVWNrSxXd0vgKytA';

/**
 * Initialize the Supabase client.
 * Using the provided project URL and the legacy anon key for institutional data access.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file to a Supabase storage bucket and return the public URL.
 */
export const uploadFile = async (bucket: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};
