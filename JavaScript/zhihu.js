/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/zhihu.js
 * @create:      2021-10-11 11:20:31.863
 * @modify:      2021-10-11 11:24:12.855
 * @version:     
 * @times:       2
 * @lines:       27
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function main() {
    $("body > div:nth-child(14) > div > div > div > div.Modal.Modal--default.signFlowModal > button").click();
}

const i = setInterval(() => {
    if (document.readyState === "complete") {
        clearInterval(i);

        main();
    }
}, 1000);
