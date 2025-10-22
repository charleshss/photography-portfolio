import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

const britishWordPattern = "(?<!-)\\b(?:favorite|behavior|center)\\b";

const nextCoreWebVitalsRules = {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
};

export default [
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
        ],
    },
    js.configs.recommended,
    {
        name: 'next/core-web-vitals',
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: nextCoreWebVitalsRules,
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            '@next/next': nextPlugin,
            react: reactPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'react-hooks/rules-of-hooks': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'react/jsx-uses-vars': 'warn',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'no-restricted-syntax': [
                'warn',
                {
                    selector: `Literal[value=/${britishWordPattern}/i]`,
                    message: 'Use British spelling (e.g. colour, favourite, centre, behaviour).',
                },
                {
                    selector: `TemplateElement[value.raw=/${britishWordPattern}/i]`,
                    message: 'Use British spelling (e.g. colour, favourite, centre, behaviour).',
                },
            ],
        },
    },
];
