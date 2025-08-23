import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export let supabase: SupabaseClient | null = null;

const looksValid = (url?: string, key?: string) => {
  return (
    !!url && url !== 'your_supabase_url' && url.startsWith('http') &&
    !!key && key !== 'your_supabase_anon_key'
  );
};

if (looksValid(supabaseUrl, supabaseAnonKey)) {
  supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      storage: AsyncStorage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export const isSupabaseConfigured = () => !!supabase;