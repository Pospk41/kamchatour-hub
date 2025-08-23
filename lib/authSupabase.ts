import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User as AppUser } from '../contexts/AuthContext';

const mapUser = (authUser: any): AppUser => ({
  id: authUser.id,
  email: authUser.email,
  name: authUser.user_metadata?.name ?? undefined,
  phone: authUser.phone ?? undefined,
});

export const sbSignIn = async (email: string, password: string): Promise<AppUser> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session?.user) {
    throw new Error(error?.message || 'Не удалось войти');
  }
  const user = mapUser(data.session.user);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const sbSignUp = async (email: string, password: string, name: string): Promise<AppUser> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error || !data.user) {
    throw new Error(error?.message || 'Не удалось зарегистрироваться');
  }
  // Подтверждение email может быть включено — сразу сессии может не быть
  const user = mapUser(data.user);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const sbSignOut = async (): Promise<void> => {
  await supabase.auth.signOut();
  await AsyncStorage.removeItem('user');
};

export const sbGetCurrentUser = async (): Promise<AppUser | null> => {
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) return null;
  return mapUser(authUser);
};