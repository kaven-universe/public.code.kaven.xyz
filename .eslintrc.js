/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /.eslintrc.js
 * @create:      2021-07-07 07:42:19.333
 * @modify:      2022-07-11 18:27:36.200
 * @times:       4
 * @lines:       31
 * @copyright:   Copyright © 2021-2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    // "extends": "eslint:recommended",
    extends: [
        "eslint:recommended",
        "@wenkai.wu/eslint-config",
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
    },
};
