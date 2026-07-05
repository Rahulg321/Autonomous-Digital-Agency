import { defineAgent, type AgentRouteHandler } from '@flue/runtime';

export const route: AgentRouteHandler = async (_c, next) => next();

export default defineAgent(() => ({
	model: 'deepseek/deepseek-v4-flash',
	instructions:
		'You are a friendly travel advisor. Give practical, concise advice about destinations, seasons, weather, and trip planning.',
}));
