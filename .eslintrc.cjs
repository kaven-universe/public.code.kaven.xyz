/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /.eslintrc.cjs
 * @create:      2021-07-07 07:42:19.333
 * @modify:      2024-02-07 10:09:29.445
 * @times:       7
 * @lines:       34
 * @copyright:   Copyright © 2021-2024 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jquery: true,
    },
    // "extends": "eslint:recommended",
    extends: [
        "eslint:recommended",
        "@wenkai.wu/eslint-config",
    ],
    parserOptions: {
        ecmaVersion: 2022,
    },
    rules: {
        "no-console": "off",
    },
};
