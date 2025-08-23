import { supabase, isSupabaseConfigured } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User as AppUser } from '../contexts/AuthContext';

const mapUser = (authUser: any): AppUser => ({
  id: authUser.id,
  email: authUser.email,
  name: authUser.user_metadata?.name ?? undefined,
  phone: authUser.phone ?? undefined,
});

export const sbSignIn = async (email: string, password: string): Promise<AppUser> => {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase не сконфигурирован');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session?.user) {
    throw new Error(error?.message || 'Не удалось войти');
  }
  const user = mapUser(data.session.user);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const sbSignUp = async (email: string, password: string, name: string): Promise<AppUser> => {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase не сконфигурирован');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error || !data.user) {
    throw new Error(error?.message || 'Не удалось зарегистрироваться');
  }
  const user = mapUser(data.user);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const sbSignOut = async (): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    await supabase.auth.signOut();
  }
  await AsyncStorage.removeItem('user');
};

export const sbGetCurrentUser = async (): Promise<AppUser | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) return null;
  return mapUser(authUser);
};