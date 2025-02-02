/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/qqsm.js
 * @create:      2023-01-22 16:44:38.451
 * @modify:      2025-02-02 20:24:05.635
 * @times:       11
 * @lines:       89
 * @copyright:   Copyright © 2023-2025 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

if (!window.QQSM) {
    window.QQSM = class {
        static running = false;
        static id;
        static layerOpen;
        static content = "";
        static contentUpdated = false;

        static click(selector) {
            const el = document.querySelector(selector);
            if (el) {
                el.click();
                return true;
            }

            return false;
        }

        static now() {
            return new Date().toISOString();
        }

        static start(index = 1, timeout = 100) {
            if (this.running) {
                return;
            }

            if (!this.layerOpen) {
                this.layerOpen = layer.open;

                layer.open = (options) => {
                    this.content = options.content;

                    const done = this.content.includes("奖品领取成功");
                    if (done) {
                        this.stop();
                    } else {
                        this.contentUpdated = true;
                    }

                    console.info(`${this.now()}, ${this.content}`);
                    
                    if (!this.running || done)    {
                        this.layerOpen(options);
                    }
                };
            }

            this.running = true;
            
            const name = document.querySelector(`#hb > dl:nth-child(${index}) > dd > p`)?.textContent;

            let t = 0;
            this.id = setInterval(() => {
                if (t > 0 || !this.contentUpdated) {
                    return;
                }

                layer.closeAll();
                
                this.contentUpdated = false;
                this.click(`#hb > dl:nth-child(${index}) > dt`);

                console.info(`${this.now()}, ${name}, index: ${index}, try: ${++t}`);
            }, timeout);
        }

        static stop() {
            clearInterval(this.id);
            this.id = undefined;
            this.running = false;
        }
    };
}
