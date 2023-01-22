/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/qqsm.js
 * @create:      2023-01-22 16:44:38.451
 * @modify:      2023-01-22 16:47:10.056
 * @times:       2
 * @lines:       42
 * @copyright:   Copyright © 2023 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

class QQSM {
    static id;

    static click(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.click();
            return true;
        }

        return false;
    }

    static start(timeout = 1000) {
        if (this.id) {
            return;
        }

        this.isRunning = setInterval(() => {                
            layer.closeAll();
            this.click("#hb > dl:nth-child(1) > dt");                
        }, timeout);            
    }

    static stop() {
        clearInterval(this.id);
    }
}