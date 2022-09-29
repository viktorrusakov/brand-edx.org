const StyleDictionary = require('style-dictionary');
const path = require('path');

const {formattedVariables, fileHeader} = StyleDictionary.formatHelpers;

const PGN_PREFIX = 'pgn';
const BASE_BUILD_PATH = path.resolve(__dirname, 'build');

/**
 * Transforms color values to be in uppercase format to be compatible with our stylelint rules.
 */
StyleDictionary.registerTransform({
    name: 'color/uppercase',
    type: 'value',
    matcher(token) {
        return token.attributes.category === 'color';
    },
    transformer(token) {
        return token.original.value.toUpperCase();
    },
});

/**
 * Overrides default scss/variables formatter to add new line at the end of file
 * to be compatible with our stylelint rules.
 */
StyleDictionary.registerFormat({
    name: 'scss/variables-with-new-line',
    formatter({dictionary, options, file}) {
        const {outputReferences, themeable = false} = options;
        return `${fileHeader({file, commentStyle: 'short'})
        + formattedVariables({
            format: 'sass', dictionary, outputReferences, themeable,
        })
        }\n`;
    },
});

const paragonStyleDictionary = StyleDictionary.extend({
    source: ['./source/**/*.json'],
    platforms: {
        scss: {
            transformGroup: 'scss',
            prefix: PGN_PREFIX,
            buildPath: `${BASE_BUILD_PATH}/`,
            files: [{
                destination: '_variables.scss',
                format: 'scss/variables-with-new-line',
                options: {
                    outputReferences: true,
                },
            }],
            transforms: StyleDictionary.transformGroup.scss.concat('color/uppercase'),
            options: {
                showFileHeader: false,
            },
        },
        css: {
            transformGroup: 'css',
            prefix: PGN_PREFIX,
            files: [
                {
                    format: 'css/variables',
                    destination: `${BASE_BUILD_PATH}/variables.css`,
                    options: {
                        outputReferences: true,
                    },
                },
                {
                    format: 'css/variables',
                    destination: path.resolve(__dirname, '../paragon/tokens.css'),
                    options: {
                        outputReferences: true,
                    },
                },
            ],
            transforms: StyleDictionary.transformGroup.css.concat('color/uppercase'),
            options: {
                showFileHeader: false,
            },
        },
    },
});

paragonStyleDictionary.buildAllPlatforms();