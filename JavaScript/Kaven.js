/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/Kaven.js
 * @create:      2021-10-11 11:20:31.863
 * @modify:      2022-01-10 17:51:51.764
 * @version:     
 * @times:       38
 * @lines:       207
 * @copyright:   Copyright © 2021-2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const K_DEV = "K_DEV";

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function DEV(enable) {
    if (enable === undefined) {
        return getCookie(K_DEV) === "true";
    }

    if (enable) {
        setCookie(K_DEV, "true", 1);
    } else {
        eraseCookie(K_DEV);
    }
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
        } while (i < 30);

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