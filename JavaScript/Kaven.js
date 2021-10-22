/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/Kaven.js
 * @create:      2021-10-11 11:20:31.863
 * @modify:      2021-10-22 17:59:12.285
 * @version:     
 * @times:       29
 * @lines:       144
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

function click(selector) {
    document.querySelector(selector)?.click();
}

function main() {
    const isZhihu = checkHostName("zhihu.com");
    const isCSDN = checkHostName("csdn.net");

    /**
     * @type { Set<string> }
     */
    const prefixSet = new Set();

    if (isZhihu) {
        prefixSet.add("https://link.zhihu.com/?target=");
        prefixSet.add("https://link.zhihu.com?target=");

        // hide login
        click("body > div:nth-child(14) > div > div > div > div.Modal.Modal--default.signFlowModal > button");
        click("body > div:nth-child(15) > div > div > div > div.Modal.Modal--default.signFlowModal > button")
    } else if (isCSDN) {
        prefixSet.add("https://link.csdn.net/?target=");
        prefixSet.add("https://link.csdn.net?target=");

        // hide top bar
        click("#csdn-toolbar > div.toolbar-advert > span");
    } else {
        return;
    }

    const windowOpen = window.open;
    // const iframe = document.createElement("iframe");
    // document.body.appendChild(iframe);
    // const windowOpen = iframe.contentWindow.open;

    window.open = function (url, name, features, replace) {

        for (const prefix of prefixSet) {
            if (url.startsWith(prefix)) {
                url = url.substr(prefix.length);
            }
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
                window.open(href, "_blank")?.focus();
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
