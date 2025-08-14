import { apiPost } from './api';
import { AuthUser } from '@lib/auth';

export async function login(email: string, password: string): Promise<AuthUser> {
	return apiPost<AuthUser>('/auth/login', { email, password });
}