/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /.eslintrc.js
 * @create:      2021-07-07 07:42:19.333
 * @modify:      2021-07-07 07:46:03.317
 * @version:     
 * @times:       3
 * @lines:       32
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
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
