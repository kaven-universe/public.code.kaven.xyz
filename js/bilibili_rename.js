/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/bilibili_rename.js
 * @create:      2024-12-08 13:14:16.704
 * @modify:      2024-12-08 15:04:16.397
 * @times:       5
 * @lines:       74
 * @copyright:   Copyright © 2024 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

// For https://member.bilibili.com/platform/upload-manager/ep

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function rename() {
    const key = "《四海兄弟_ 最终版》 ";

    const rows = document.querySelectorAll("#cc-body > div.cc-content-body.upload-manage.pos-center > div.content > div:nth-child(2) > div > div.ep-edit-section-list > div.ep-table > div:nth-child(2) > div");
    for (const row of rows) {

        const titleText = row.querySelector(".title-text-content").textContent;

        if (!titleText.startsWith(key)) {
            continue;
        }

        console.info("rename row: ", titleText);

        // Edit
        row.querySelector("span.ep-section-edit-video-list-item-operate-btn").click();

        await sleep(100);
        const input = document.querySelector("#cc-body > div.cc-content-body.upload-manage.pos-center > div.content > div:nth-child(2) > div.ep-modal > div > div > div.edit-av-modal-body > div:nth-child(2) > div > div > label > input[type=text]");
        if (input) {
            if (input.value.startsWith(key)) {

                let title = input.value.substring(key.length);
                title = title.replaceAll("-", "").replaceAll(" ", "").trim();

                input.value = "四海兄弟 最终版" + title;

                // Optionally trigger an input event for dynamic updates
                const event = new Event("input", { bubbles: true });
                input.dispatchEvent(event);

                await sleep(100);
                console.info($(input));

                // OK
                document.querySelector("#cc-body > div.cc-content-body.upload-manage.pos-center > div.content > div:nth-child(2) > div.ep-modal > div > div > div.edit-av-modal-submit > div.ep-button.ep-button-primary > span").click();
                await sleep(5000);
                continue;
            }
        }

        // Cancel
        document.querySelector("#cc-body > div.cc-content-body.upload-manage.pos-center > div.content > div:nth-child(2) > div.ep-modal > div > div > div.edit-av-modal-submit > div.ep-button.ep-button-default > span").click();
    }

    console.info("done");
}

function add() {
    document.querySelectorAll("#cc-body > div.cc-content-body.upload-manage.pos-center > div.content > div:nth-child(2) > div.ep-modal > div > div > div > div:nth-child(2) > div.add-av-modal-step-1-select > div > div:nth-child(1) > div > div > div.ep-select-box-item-all-checkbox > i").forEach(p => p.click());
}

rename().catch(console.error);
