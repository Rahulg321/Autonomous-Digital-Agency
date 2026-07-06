import { defineAgent, defineWorkflow, type WorkflowRouteHandler } from '@flue/runtime';
import { cloudflareSandbox } from '@flue/runtime/cloudflare';
import { getSandbox } from '@cloudflare/sandbox';
import * as v from 'valibot';

const TEMPLATE_REPO =
	'https://github.com/Rahulg321/Agency-Website-Starter-Template.git';
const SITE = '/workspace/site';

export const route: WorkflowRouteHandler = async (_c, next) => next();

const builder = defineAgent<Env>(({ id, env }) => ({
	model: 'deepseek/deepseek-v4-flash',
	sandbox: cloudflareSandbox(getSandbox(env.Sandbox, id)),
	cwd: '/workspace',
}));

export default defineWorkflow({
	agent: builder,
	input: v.object({}),

	async run({ harness }) {
		await harness.shell(`git clone --depth 1 ${TEMPLATE_REPO} ${SITE}`);
		await harness.shell('bun install', { cwd: SITE });
		await harness.shell('cp brief.example.json brief.json', { cwd: SITE });
		await harness.shell('bun run apply-brief && bun run build', { cwd: SITE });
		return { projectDir: SITE };
	},
});
