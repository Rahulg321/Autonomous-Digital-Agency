import { defineAgent, defineWorkflow, type WorkflowRouteHandler } from '@flue/runtime';
import { cloudflareSandbox } from '@flue/runtime/cloudflare';
import { getSandbox } from '@cloudflare/sandbox';
import * as v from 'valibot';

const TEMPLATE_REPO =
	'https://github.com/Rahulg321/Agency-Website-Starter-Template.git';
const WORKSPACE = '/workspace';
const PROJECT_DIR = `${WORKSPACE}/site`;

export const route: WorkflowRouteHandler = async (_c, next) => next();

const builder = defineAgent(({ id, env }) => ({
	model: 'deepseek/deepseek-v4-flash',
	cwd: WORKSPACE,
	sandbox: cloudflareSandbox(getSandbox(env.Sandbox, id), { cwd: WORKSPACE }),
	instructions: [
		'You are a website builder agent working inside a Linux sandbox.',
		`The starter template lives at ${PROJECT_DIR}.`,
		'Use shell commands to install deps, run apply-brief, build, and edit files.',
		'Prefer bun over npm. Read harness docs in docs/HARNESS.md when unsure.',
	].join(' '),
}));

export default defineWorkflow({
	agent: builder,
	input: v.object({
		briefJson: v.optional(v.string()),
		cloneTemplate: v.optional(v.boolean(), true),
	}),

	async run({ harness, input }) {
		if (input.cloneTemplate) {
			const clone = await harness.shell(
				`git clone --depth 1 ${TEMPLATE_REPO} ${PROJECT_DIR}`,
			);
			if (clone.exitCode !== 0) {
				throw new Error(`git clone failed: ${clone.stderr || clone.stdout}`);
			}

			const install = await harness.shell('bun install', { cwd: PROJECT_DIR });
			if (install.exitCode !== 0) {
				throw new Error(`bun install failed: ${install.stderr || install.stdout}`);
			}
		}

		if (input.briefJson) {
			await harness.fs.writeFile(`${PROJECT_DIR}/brief.json`, input.briefJson);
		} else {
			await harness.shell(`cp brief.example.json brief.json`, { cwd: PROJECT_DIR });
		}

		const session = await harness.session();
		const response = await session.prompt(
			[
				`Brief is in ${PROJECT_DIR}/brief.json (create from brief.example.json if missing).`,
				`Run: cd ${PROJECT_DIR} && bun run apply-brief && bun run build`,
				'Report what theme was applied and whether the build succeeded.',
			].join('\n'),
		);

		return {
			message: response.text,
			projectDir: PROJECT_DIR,
		};
	},
});
