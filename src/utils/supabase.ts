// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://nzxjjmkgwsblivxityqy.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56eGpqbWtnd3NibGl2eGl0eXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTA4MjMsImV4cCI6MjA4ODYyNjgyM30.oavQIEcwnUBNiF-nsW9eGl2bA4p_z_0-pmpYsdFRY4E';

if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL environment variable');
  throw new Error('SUPABASE_URL is required');
}

if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  console.error('Invalid SUPABASE_URL format:', supabaseUrl);
  throw new Error('SUPABASE_URL must start with http:// or https://');
}

if (!supabaseAnonKey) {
  console.error('Missing SUPABASE_ANON_KEY environment variable');
  throw new Error('SUPABASE_ANON_KEY is required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: admin client if you need to bypass RLS sometimes
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56eGpqbWtnd3NibGl2eGl0eXF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA1MDgyMywiZXhwIjoyMDg4NjI2ODIzfQ.ZlBS_UWoxDFyViQsXShj9FpsqLXKkLZtUrV6Mm85CLg'
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56eGpqbWtnd3NibGl2eGl0eXF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA1MDgyMywiZXhwIjoyMDg4NjI2ODIzfQ.ZlBS_UWoxDFyViQsXShj9FpsqLXKkLZtUrV6Mm85CLg', {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

  // src/utils/supabase.ts
// import { createClient } from '@supabase/supabase-js';

// // Public client (for general use, respects RLS)
// export const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

// // Admin client (bypasses RLS — only use server-side!)
// export const supabaseAdmin = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false,
//     },
//   }
// );