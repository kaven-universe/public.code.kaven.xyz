/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/browser.js
 * @create:      2021-10-11 11:20:31.863
 * @modify:      2024-04-22 17:07:49.334
 * @times:       70
 * @lines:       342
 * @copyright:   Copyright © 2021-2024 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

(() => {
    class Kaven {
        static Keys = {
            DEV: "K_DEV",
            AUTO_REFRESH_INTERVAL: "AUTO_REFRESH_INTERVAL",
            AUTO_REFRESH_INTERVAL_MAX: "AUTO_REFRESH_INTERVAL_MAX",
            AUTO_REFRESH_TIMES: "AUTO_REFRESH_TIMES",
        };

        static setCookie(name, value, days) {
            name = "F5BBCA110AD3BDF4AF326BDD588741EC" + "_" + name;

            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        static getCookie(name) {
            name = "F5BBCA110AD3BDF4AF326BDD588741EC" + "_" + name;

            const nameEQ = name + "=";
            const ca = document.cookie.split(";");
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == " ") c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        static eraseCookie(name) {
            name = "F5BBCA110AD3BDF4AF326BDD588741EC" + "_" + name;
            
            document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }

        static DEV(enable) {
            if (enable === undefined) {
                return Kaven.getCookie(Kaven.Keys.DEV) === "true";
            }

            if (enable) {
                Kaven.setCookie(Kaven.Keys.DEV, "true", 1);
            } else {
                Kaven.eraseCookie(Kaven.Keys.DEV);
            }
        }

        /**
         * 
         * @param { String } h 
         * @returns 
         */
        static checkHostName(h) {
            const hostname = window.location.hostname.toLowerCase();

            if (hostname === h) {
                return true;
            }

            if (hostname.endsWith(`.${h}`)) {
                return true;
            }

            return false;
        }

        static click(selector) {
            const el = document.querySelector(selector);
            if (el) {
                el.click();
                return true;
            }

            return false;
        }

        static getTableColumnCells(selector, col = 0) {
            const tab = document.querySelector(selector);
            const n = tab.rows.length;

            const cells = [];

            // First check that col is not less then 0
            if (col < 0) {
                return cells;
            }

            for (let i = 0; i < n; i++) {
                const tr = tab.rows[i];
                if (tr.cells.length > col) {
                    const td = tr.cells[col];
                    cells.push(td);
                }
            }

            return cells;
        }

        static getTableColumnText(selector, col = 0, sep = "\r\n") {
            const list = Kaven.getTableColumnCells(selector, col).map(p => p.innerText);

            if (sep !== undefined) {
                return list.join(sep);
            }

            return list;
        }

        /**
         * @param { string } styles 
         */
        static addCss(styles) {
            const styleSheet = document.createElement("style");
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        }

        static getRandomValue(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /**
         * By default, it refreshes automatically every 1 to 5 minutes.
         * @param { number } interval in ms
         * @param { number } intervalMax is ms
         */
        static startAutoRefreshPage(interval = 60 * 1000, intervalMax = 5 * 60 * 1000) {
            Kaven.setCookie(Kaven.Keys.AUTO_REFRESH_INTERVAL, interval);
            Kaven.setCookie(Kaven.Keys.AUTO_REFRESH_INTERVAL_MAX, intervalMax);

            Kaven._internalRefreshPage();
        }

        static stopAutoRefreshPage() {
            Kaven.eraseCookie(Kaven.Keys.AUTO_REFRESH_INTERVAL);
            Kaven.eraseCookie(Kaven.Keys.AUTO_REFRESH_TIMES);
        }

        static _internalRefreshPage() {
            const interval = Number(Kaven.getCookie(Kaven.Keys.AUTO_REFRESH_INTERVAL));
            if (interval > 0) {
                const intervalMax = Number(Kaven.getCookie(Kaven.Keys.AUTO_REFRESH_INTERVAL_MAX));
                const ms = intervalMax > interval ? Kaven.getRandomValue(interval, intervalMax) : interval;

                console.info(`The page will automatically refresh after ${ms} milliseconds`);

                // Allow users to interrupt, just refresh the page
                Kaven.eraseCookie(Kaven.Keys.AUTO_REFRESH_INTERVAL);

                setTimeout(() => {
                    let times = Number(Kaven.getCookie(Kaven.Keys.AUTO_REFRESH_TIMES));
                    if (Number.isNaN(times)) {
                        times = 0;
                    }
                    times++;
                    Kaven.setCookie(Kaven.Keys.AUTO_REFRESH_TIMES, times);

                    // Re-save the value to trigger the next refresh
                    Kaven.setCookie(Kaven.Keys.AUTO_REFRESH_INTERVAL, interval);

                    location.reload();
                }, ms);
            }
        }

        static main() {
            const isZhihu = Kaven.checkHostName("zhihu.com");
            const isCSDN = Kaven.checkHostName("csdn.net");
            const isJianshu = Kaven.checkHostName("jianshu.com");
            const isChatGpt = Kaven.checkHostName("chat.openai.com");
            const isOSChina = Kaven.checkHostName("oschina.net");

            if (Kaven.DEV()) {
                console.info(`isZhihu:${isZhihu}, isCSDN:${isCSDN}, isJianshu:${isJianshu}`);
            }

            const times = Number(Kaven.getCookie(Kaven.Keys.AUTO_REFRESH_TIMES));
            if (times) {
                console.info(`_refreshPage:${times}`);

                Kaven._internalRefreshPage();
            }

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
                    if (Kaven.click(`body > div:nth-child(${i}) > div > div > div > div.Modal.Modal--default.signFlowModal > button`)) {
                        break;
                    }

                    i++;
                } while (i < 50);

            } else if (isCSDN) {
                prefixSet.add("https://link.csdn.net/?target=");
                prefixSet.add("https://link.csdn.net?target=");

                // hide top bar
                Kaven.click("#csdn-toolbar > div.toolbar-advert > span");

                Kaven.click("#csdn-redpack > em");
                Kaven.click("#csdn-redpack > div > em");

                Kaven.click("#passportbox > img");

                $(document).on("DOMNodeInserted", () => {
                    $("passport-login-container")?.remove();
                });
            } else if (isJianshu) {
                prefixSet.add("https://link.jianshu.com/?t=");
                prefixSet.add("https://links.jianshu.com/go?to=");
            } else if (isChatGpt) {
                Kaven.addCss(`.w-full.text-token-text-primary div div {
                    max-width: none;
                }`);
            } else if (isOSChina) {
                prefixSet.add("https://www.oschina.net/action/GoToLink?url=");
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

                if (Kaven.DEV()) {
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

                if (Kaven.DEV()) {
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

                return checkLink(target.parentElement);
            };

            /**
             * @param {MouseEvent} e 
             */
            const click = (e) => {
                if (Kaven.DEV()) {
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
            };

            document.removeEventListener("click", click);
            document.addEventListener("click", click);
        }
    }

    if (document.readyState === "complete") {
        Kaven.main();
    } else {
        const i = setInterval(() => {
            if (document.readyState === "complete") {
                clearInterval(i);

                Kaven.main();
            }
        }, 850);
    }

    window.Kaven = Kaven;
})();