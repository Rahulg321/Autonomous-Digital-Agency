import { flue } from '@flue/runtime/routing';
import { Hono, type MiddlewareHandler } from 'hono';
import { authenticate } from './auth.ts';

const requireUser: MiddlewareHandler = async (c, next) => {
	const user = await authenticate(c.req.raw);

	if (!user) {
		return c.json({ error: 'Unauthorized' }, 401);
	}

	c.set('user', user);
	await next();
};

const app = new Hono<{ Variables: { user: Awaited<ReturnType<typeof authenticate>> } }>();

// Public routes — no auth required
app.get('/health', (c) => c.json({ ok: true }));

app.get('/ping', (c) =>
	c.json({
		pong: true,
		time: new Date().toISOString(),
	}),
);

app.get('/echo', (c) => {
	const message = c.req.query('message') ?? 'hello';
	return c.json({ echo: message });
});

app.get('/routes', (c) =>
	c.json({
		public: ['/health', '/ping', '/echo', '/routes', '/webhooks/test'],
		protected: ['/api/me', '/agents/*', '/workflows/*', '/channels/*'],
		flue: ['/agents/:name/:id', '/workflows/:name', '/channels/:name/*'],
	}),
);

// Dummy webhook — accepts any JSON body, returns 202 (like the routing guide pattern)
app.post('/webhooks/test', async (c) => {
	const body = await c.req.json().catch(() => null);
	return c.json({ received: true, body }, 202);
});

// Protected application route — requires Bearer token
app.get('/api/me', requireUser, (c) => c.json({ user: c.get('user') }));

// Flue agents, workflows, and channels (auth required)
app.use('/agents/*', requireUser);
app.use('/workflows/*', requireUser);
app.use('/channels/*', requireUser);
app.route('/', flue());

export default app;
