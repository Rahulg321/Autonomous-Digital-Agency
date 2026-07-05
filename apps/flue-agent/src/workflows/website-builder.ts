import {
	defineAgent,
	defineWorkflow,
	type FlueHarness,
	type ShellOptions,
	type ShellResult,
	type WorkflowRouteHandler,
} from '@flue/runtime';
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
		'Use shell commands to edit files and run validation when asked.',
		'Prefer bun over npm.',
	].join(' '),
}));

function log(step: string, data?: Record<string, unknown>) {
	console.log(
		JSON.stringify({
			workflow: 'website-builder',
			step,
			...data,
			timestamp: new Date().toISOString(),
		}),
	);
}

async function runShell(
	harness: FlueHarness,
	step: string,
	command: string,
	options?: ShellOptions,
): Promise<ShellResult> {
	log(`${step}:start`, { command, cwd: options?.cwd ?? WORKSPACE });
	const result = await harness.shell(command, options);
	log(`${step}:done`, {
		command,
		exitCode: result.exitCode,
		stdoutPreview: result.stdout.slice(0, 500),
		stderrPreview: result.stderr.slice(0, 500),
	});
	if (result.exitCode !== 0) {
		throw new Error(`${step} failed: ${result.stderr || result.stdout}`);
	}
	return result;
}

const BUILD_TIMEOUT_MS = 5 * 60 * 1000;

export default defineWorkflow({
	agent: builder,
	input: v.object({
		briefJson: v.optional(v.string()),
		cloneTemplate: v.optional(v.boolean(), true),
	}),

	async run({ harness, input }) {
		log('run:start', { cloneTemplate: input.cloneTemplate });

		try {
			if (input.cloneTemplate) {
				await runShell(
					harness,
					'git-clone',
					`git clone --depth 1 ${TEMPLATE_REPO} ${PROJECT_DIR}`,
				);
				await runShell(harness, 'bun-install', 'bun install', { cwd: PROJECT_DIR });
			}

			if (input.briefJson) {
				log('brief:write-custom');
				await harness.fs.writeFile(`${PROJECT_DIR}/brief.json`, input.briefJson);
			} else {
				await runShell(harness, 'brief:copy-example', 'cp brief.example.json brief.json', {
					cwd: PROJECT_DIR,
				});
			}

			const applyBrief = await runShell(
				harness,
				'apply-brief',
				'bun run apply-brief',
				{ cwd: PROJECT_DIR },
			);

			// Run build immediately — do not use harness.fs.readFile here; it can
			// stall the workflow DO after apply-brief in production.
			const build = await runShell(harness, 'build', 'bun run build', {
				cwd: PROJECT_DIR,
				timeoutMs: BUILD_TIMEOUT_MS,
			});

			const briefApplied = await harness.shell('cat brief.applied.json', {
				cwd: PROJECT_DIR,
			});

			log('run:complete', {
				projectDir: PROJECT_DIR,
				briefAppliedExitCode: briefApplied.exitCode,
			});

			return {
				projectDir: PROJECT_DIR,
				applyBriefStdout: applyBrief.stdout,
				buildStdout: build.stdout.slice(0, 1000),
				briefApplied: briefApplied.exitCode === 0 ? briefApplied.stdout : null,
			};
		} catch (error) {
			log('run:error', {
				message: error instanceof Error ? error.message : String(error),
			});
			throw error;
		}
	},
});
