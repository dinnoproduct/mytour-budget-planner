# Run Test Coverage

Run Vitest with V8 coverage reporting.

```bash
npm run test:coverage
```

Execute the full test suite with coverage enabled (V8 provider → lcov report). Coverage scope is `src/shared/utils/**/*.ts`. When done, report the overall coverage percentages (statements, branches, functions, lines) and call out any files below 80% coverage.
