/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/zhihu.js
 * @create:      2021-10-11 11:20:31.863
 * @modify:      2021-10-11 13:37:30.313
 * @version:     
 * @times:       6
 * @lines:       60
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function main() {
    console.log("kaven script loaded");

    // hide login
    document.querySelector("body > div:nth-child(14) > div > div > div > div.Modal.Modal--default.signFlowModal > button").click();

    document.addEventListener("click", function (e) {
        // console.log(this, e);

        /**
         * @type { string | undefined }
         */
        const tagName = e.target.tagName;
        if (tagName?.toLowerCase() === "a") {

            /**
             * @type { string }
             */
            const href = e.target.href;

            if (href) {
                const prefix = "https://link.zhihu.com/?target=";

                let url = href;
                if (url.startsWith(prefix)) {
                    url = url.substr(prefix.length);
                }

                console.log("open: ", url);

                window.open(url, "_blank").focus();
                e.preventDefault();
            }
        }
    });
}

const i = setInterval(() => {
    if (document.readyState === "complete") {
        clearInterval(i);

        main();
    }
}, 1000);
