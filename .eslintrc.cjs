module.exports = {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      settings: { react: { version: 'detect' } },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
        // 'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      plugins: ['unused-imports'],
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      overrides: [
        {
          files: ['{src,@types}/**/*.{ts,tsx}'],
          extends: [
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
            'plugin:import/typescript',
          ],
          settings: {
            'import/resolver': {
              typescript: true,
            },
          },
          rules: {
            'no-restricted-imports': 'off',

            'import/no-unresolved': 'off',

            '@typescript-eslint/no-restricted-imports': [
              'error',
              {
                paths: [

                ],
              },
            ],
            '@typescript-eslint/ban-ts-comment': ['off', { 'ts-expect-error': true }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unnecessary-type-arguments': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/consistent-type-imports': [
              'error',
              { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
          },
          parser: '@typescript-eslint/parser',
          parserOptions: {
            // tsconfigRootDir: process.cwd(),
            project: './tsconfig.json',
            EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true,
          },
        },
      ],
      ignorePatterns: ['node_modules', 'dist', 'public'],
      rules: {
        '@typescript-eslint/*': 'off',

        'prettier/prettier': [
          'error',
          {
            printWidth: 120,
            singleQuote: true,
            tabWidth: 2,
            arrowParens: 'always',
          },
          {
            usePrettierrc: false,
          },
        ],

        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['warn', { ignoreRestSiblings: true, args: 'after-used' }],

        'import/no-named-as-default-member': 'off',
        'import/no-named-as-default': 'off',

        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single', { avoidEscape: true }],
        'jsx-quotes': ['error', 'prefer-double'],
        'one-var': 'off',
        'no-debugger': 'warn',
        'no-plusplus': 'off',
        'one-var-declaration-per-line': 'off',
        'function-paren-newline': 'off',
        'object-curly-newline': [
          'off',
          {
            ObjectExpression: 'always',
            ObjectPattern: {
              minProperties: 2,
            },
          },
        ],
        'object-shorthand': ['error', 'properties'],

        'react/display-name': 'off',
        'react/jsx-curly-brace-presence': [
          'error',
          {
            props: 'never',
            children: 'never',
          },
        ],
        'react/forbid-prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',

        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/label-has-for': 'off',
        'jsx-a11y/no-autofocus': 'off',
        'jsx-a11y/label-has-associated-control': 'off',

        'padding-line-between-statements': [
          'error',
          { blankLine: 'always', prev: '*', next: 'return' },
          { blankLine: 'always', prev: '*', next: 'block-like' },
          { blankLine: 'always', prev: 'block-like', next: '*' },
        ],
        'arrow-body-style': ['error', 'as-needed'],
        'arrow-parens': 'off',

        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'react',
                importNames: ['default'],
              },
            ],
          },
        ],
      },
};