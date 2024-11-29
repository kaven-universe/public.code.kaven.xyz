/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /eslint.config.mjs
 * @create:      2024-11-29 11:07:57.272
 * @modify:      2024-11-29 14:14:12.036
 * @times:       9
 * @lines:       32
 * @copyright:   Copyright © 2024 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import configs, { globals } from "@wenkai.wu/eslint-config";

export default [
    ...configs,
    {
        languageOptions: {
            globals: { 
                ...globals.node, 
                ...globals.browser,
                ...globals.jquery,                
            }, 
        },
        rules: {
            "no-console": "off",
        },
    },
];
