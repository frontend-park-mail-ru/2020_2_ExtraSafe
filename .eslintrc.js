module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
    },
    'extends': [
        'google',
    ],
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'rules': {
        'max-len': [1, 120, 2, {ignoreComments: true}],
        'indent': ['error', 4],
    },
};
