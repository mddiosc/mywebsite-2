module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm preview --host 127.0.0.1 --port 4173',
      startServerReadyPattern: 'Local:\\s+http://127.0.0.1:4173/',
      startServerReadyTimeout: 20000,
      url: ['http://127.0.0.1:4173/', 'http://127.0.0.1:4173/es/', 'http://127.0.0.1:4173/en/'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
