import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{ts,js}'],
		environment: 'node',
		// Setup file: ensures the module can import even if SvelteKit's
		// generated types are stale. Doesn't set any tokens.
		setupFiles: ['./src/test/setup.ts'],
	},
	// Run serially: the github cache is module-level (singleton
	// Map), so parallel tests can race each other.
	pool: 'forks',
	poolOptions: {
		forks: { singleFork: true },
	},
});
