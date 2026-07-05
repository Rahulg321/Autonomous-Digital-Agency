declare global {
	interface Env {
		API_KEY?: string;
		DEEPSEEK_API_KEY?: string;
		Sandbox: DurableObjectNamespace;
	}
}

declare module 'cloudflare:workers' {
	export const env: Env;
}

export {};
