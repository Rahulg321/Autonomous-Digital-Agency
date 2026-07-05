import { env } from 'cloudflare:workers';

export type AuthUser = {
	id: string;
};

export async function authenticate(request: Request): Promise<AuthUser | null> {
	const authorization = request.headers.get('Authorization');
	if (!authorization?.startsWith('Bearer ')) {
		return null;
	}

	const token = authorization.slice('Bearer '.length).trim();
	const expected = (env as { API_KEY?: string }).API_KEY;

	if (!expected || token !== expected) {
		return null;
	}

	return { id: 'api-key' };
}
