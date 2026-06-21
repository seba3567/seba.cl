// Vitest setup: provide a stub token so the github module can
// import without error. The token is never used in unit tests
// because we mock fetch directly.
process.env.GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? 'test-token-stub';
