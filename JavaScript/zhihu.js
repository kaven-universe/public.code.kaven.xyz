/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/zhihu.js
 * @create:      2021-10-11 11:20:31.863
 * @modify:      2021-10-11 16:07:13.429
 * @version:     
 * @times:       19
 * @lines:       86
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function main() {

    // hide login
    document.querySelector("body > div:nth-child(14) > div > div > div > div.Modal.Modal--default.signFlowModal > button").click();

    const windowOpen = window.open;
    const prefix = "https://link.zhihu.com/?target=";

    window.open = function (url, name, features, replace) {

        if (url.startsWith(prefix)) {
            url = url.substr(prefix.length);
        }

        url = decodeURIComponent(url);

        console.log("open: ", url);

        return windowOpen(url, name, features, replace);
    }

    /**
     * 
     * @param { HTMLLinkElement } target 
     */
    const checkLink = (target) => {

        console.log("check: ", target);

        const tagName = target.tagName;
        if (tagName?.toLowerCase() === "a") {

            const href = target.href;

            if (href) {
                window.open(href, "_blank").focus();
                return true;
            }
        }

        return false;
    }

    document.addEventListener("click", function (e) {
        console.log(e);

        if (checkLink(e.target)) {
            e.preventDefault();
        } else {
            const path = e.path;
            if (Array.isArray(path) && path.length > 1) {
                let i = 1;
                do {
                    if (checkLink(path[i])) {
                        e.preventDefault();
                        break;
                    }
                } while (i-- < 5);
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
