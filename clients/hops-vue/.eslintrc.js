module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'max-len': [
            1,
            {
                code: 140
            }
        ],
        'comma-dangle': 0,
        indent: [ 'error', 4 ],
        'no-param-reassign': [
            'error',
            {
                props: true,
                ignorePropertyModificationsFor: [ 'state' ] // vue mutations modify state properties all the time
            }
        ],
        'no-plusplus': 0 // I've never had an issue with it.
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
