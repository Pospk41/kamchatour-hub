import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
	auth: {
		storage: AsyncStorage as any,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});