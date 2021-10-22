/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/Kaven.js
 * @create:      2021-10-11 11:20:31.863
 * @modify:      2021-10-22 16:57:41.015
 * @version:     
 * @times:       23
 * @lines:       125
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function DEV() {
    return "K_DEV" in window && window["K_DEV"] === true;
}

/**
 * 
 * @param { String } h 
 * @returns 
 */
function checkHostName(h) {
    const hostname = window.location.hostname.toLowerCase();

    if (hostname === h) {
        return true;
    }

    if (hostname.endsWith(`.${h}`)) {
        return true;
    }

    return false;
}

function main() {
    const isZhihu = checkHostName("zhihu.com");
    const isCSDN = checkHostName("csdn.net");

    let prefix = "";

    if (isZhihu) {
        prefix = "https://link.zhihu.com/?target=";

        // hide login
        document.querySelector("body > div:nth-child(14) > div > div > div > div.Modal.Modal--default.signFlowModal > button").click();
    } else if (isCSDN) {
        prefix = "https://link.csdn.net/?target=";
    } else {
        return;
    }

    const windowOpen = window.open;
    window.open = function (url, name, features, replace) {

        if (url.startsWith(prefix)) {
            url = url.substr(prefix.length);
        }

        url = decodeURIComponent(url);

        if (DEV()) {
            console.log("open: ", url);
        }

        return windowOpen(url, name, features, replace);
    }

    /**
     * 
     * @param { HTMLLinkElement } target 
     */
    const checkLink = (target) => {

        if (DEV()) {
            console.log("check: ", target);
        }

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
        if (DEV()) {
            console.log(e);
        }

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
}, 200);
