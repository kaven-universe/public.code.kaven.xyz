/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /ts/poems.ts
 * @create:      2025-01-17 15:55:42.164
 * @modify:      2025-01-17 16:09:46.049
 * @times:       2
 * @lines:       49
 * @copyright:   Copyright © 2025 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import { Distinct } from "kaven-basic";
import { LoadJsonFile, SaveJsonConfig } from "kaven-utils";

const poemsFile = "../public.data.kaven.xyz/json/poems.json";

const _demo = {
    text: "路漫漫其修远兮，吾将上下而求索。",
    author: "屈原",
    from: "离骚",
    description: "",
    tags: [
        "先秦",
    ],
    refs: [
        "https://public.data.kaven.xyz/json/poems.json",
    ],
};

type TPoem = typeof _demo;

const poems = await LoadJsonFile<TPoem[]>(poemsFile);

for (const poem of poems) {
    poem.text = poem.text.trim();
    poem.author = poem.author.trim();
    poem.from = poem.from.trim();
    poem.description = poem.description.trim();
    poem.tags = Distinct(poem.tags.map(p => p.trim()));
    poem.refs = Distinct(poem.refs.map(p => p.trim()));
}

poems.sort((a, b) => a.text.localeCompare(b.text, "zh"));

await SaveJsonConfig(poems, poemsFile);
