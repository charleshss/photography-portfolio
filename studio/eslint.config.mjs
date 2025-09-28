import studio from '@sanity/eslint-config-studio'

const britishWordPattern = "(?<!-)\\b(?:favorite|behavior|center)\\b";

const britishSpellingRule = {
    rules: {
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
};

export default [...studio, britishSpellingRule];
