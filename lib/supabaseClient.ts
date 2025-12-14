import { createClient } from '@supabase/supabase-js';

// TODO: Move these to environment variables (Vercel Settings) for security
const supabaseUrl = 'https://nabrfakiojcnwbhqupqw.supabase.co';
const supabaseKey = 'sb_publishable_mpDuJHYUSYlwrYws5LxF_w_rT82S9i6';

export const supabase = createClient(supabaseUrl, supabaseKey);
