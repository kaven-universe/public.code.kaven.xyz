/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/qqsm.js
 * @create:      2023-01-22 16:44:38.451
 * @modify:      2023-01-22 16:44:38.451
 * @times:       1
 * @lines:       18
 * @copyright:   Copyright © 2023 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

class QQSM {
    static id;

    static start(timeout = 1000) {
        if (this.id) {
            return;
        }

        this.isRunning = setInterval(() => {                
            layer.closeAll();
            Kaven.click("#hb > dl:nth-child(1) > dt");                
        }, timeout);            
    }

    static stop() {
        clearInterval(this.id);
    }
}