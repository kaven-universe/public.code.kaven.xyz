/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/Kaven.js
 * @create:      2021-10-11 11:20:31.863
 * @modify:      2021-10-23 00:12:22.244
 * @version:     
 * @times:       37
 * @lines:       171
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
    const el = document.querySelector(selector);
    if (el) {
        el.click();
        return true;
    }

    return false;
}

function main() {
    const isZhihu = checkHostName("zhihu.com");
    const isCSDN = checkHostName("csdn.net");
    const isJianshu = checkHostName("jianshu.com");

    /**
     * @type { Set<string> }
     */
    const prefixSet = new Set();

    if (isZhihu) {
        prefixSet.add("https://link.zhihu.com/?target=");
        prefixSet.add("https://link.zhihu.com?target=");

        // hide login
        let i = 10;
        do {
            if (click(`body > div:nth-child(${i}) > div > div > div > div.Modal.Modal--default.signFlowModal > button`)) {
                break;
            }

            i++;
        } while (i < 25);

    } else if (isCSDN) {
        prefixSet.add("https://link.csdn.net/?target=");
        prefixSet.add("https://link.csdn.net?target=");

        // hide top bar
        click("#csdn-toolbar > div.toolbar-advert > span");

        click("#csdn-redpack > em");
        click("#csdn-redpack > div > em");
    } else if (isJianshu) {
        prefixSet.add("https://link.jianshu.com/?t=");
        prefixSet.add("https://links.jianshu.com/go?to=");
    } else {
        return;
    }

    const windowOpen = window.open;
    // const iframe = document.createElement("iframe");
    // document.body.appendChild(iframe);
    // const windowOpen = iframe.contentWindow.open;

    window.open = function(url, name, features, replace) {

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
    };

    /**
     * 
     * @param { HTMLLinkElement } target 
     */
    const checkLink = (target) => {

        if (!target) {
            return false;
        }
        
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
    };

    document.addEventListener("click", function(e) {
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
                } while (i++ < 5);
            }
        }
    });
}

if (document.readyState === "complete") {
    main();
} else {
    const i = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(i);

            main();
        }
    }, 850);
}