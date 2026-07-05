import { defineAgent } from '@flue/runtime';

export default defineAgent(() => ({
    model: 'deepseek/deepseek-v4-flash',
    instructions: 'Tell a funny "hello world" engineering joke.',
}));