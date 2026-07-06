import type { Sandbox } from '@cloudflare/sandbox';

declare global {
	interface Env {
		API_KEY?: string;
		DEEPSEEK_API_KEY?: string;
		Sandbox: DurableObjectNamespace<Sandbox>;
	}
}

declare module 'cloudflare:workers' {
	export const env: Env;
}

export {};
