/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /eslint.config.mjs
 * @create:      2024-11-29 11:07:57.272
 * @modify:      2024-11-29 11:12:05.546
 * @times:       5
 * @lines:       26
 * @copyright:   Copyright © 2024 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import configs, { globals } from "@wenkai.wu/eslint-config";

export default [
    ...configs,
    {
        languageOptions: { globals: { ...globals.node } },
        rules: {
            "no-console": "off",
        },
    },
];
