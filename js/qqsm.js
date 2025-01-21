/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/qqsm.js
 * @create:      2023-01-22 16:44:38.451
 * @modify:      2025-01-22 06:36:35.126
 * @times:       7
 * @lines:       53
 * @copyright:   Copyright © 2023-2025 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

if (!window.QQSM) {
    window.QQSM = class {
        static id;

        static click(selector) {
            const el = document.querySelector(selector);
            if (el) {
                el.click();
                return true;
            }

            return false;
        }

        static start(timeout = 1000, index = 1) {
            if (this.id) {
                return;
            }

            let t = 0;
            this.id = setInterval(() => {
                layer.closeAll();
                
                this.click(`#hb > dl:nth-child(${index}) > dt`);

                const name = document.querySelector(`#hb > dl:nth-child(${index}) > dd > p`)?.textContent;
                const result = document.querySelector("div.layui-layer-content")?.textContent;

                console.info(`[${new Date().toISOString()}][${name}] -> ${result}, index: ${index}, try: ${++t}`);
            }, timeout);
        }

        static stop() {
            clearInterval(this.id);
            this.id = undefined;
        }
    };
}
