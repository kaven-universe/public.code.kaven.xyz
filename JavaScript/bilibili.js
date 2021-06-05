/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/bilibili.js
 * @create:      2021-06-05 10:33:40.467
 * @modify:      2021-06-05 11:01:32.756
 * @version:     
 * @times:       11
 * @lines:       81
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function skip(...fromToPairs) {

    const interval = 1000; // ms
    let skip = 0;

    function parseSeconds(time) {
        if (typeof time === "string") {
            // HH:MM:SS
            const parts = time.split(":").map(p => parseInt(p));

            switch (parts.length) {
                case 1:
                    time = parts[0];
                    break;

                case 2:
                    time = parts[0] * 60 + parts[1];
                    break;

                case 3:
                    time = parts[0] * 60 * 60 + parts[1] * 60 + parts[2];
                    break;
            }
        }

        if (typeof time === "number") {
            return time;
        }

        console.error("Invalid time: ", time);
        return undefined;
    }

    function seek(from, to) {
        const fromSeconds = parseSeconds(from);
        const toSeconds = parseSeconds(to);

        if (from === undefined || to === undefined) {
            return;
        }

        let currentTime = window.player.getCurrentTime();
        if (currentTime >= fromSeconds && currentTime < toSeconds) {
            console.log(`seek from ${from} to ${to}, ${fromSeconds} -> ${toSeconds}`);
            skip = 5;
            return window.player.seek(toSeconds);
        }
    }

    if (window.kavenSkipTimer) {
        clearInterval(window.kavenSkipTimer);
        window.kavenSkipTimer = undefined;
    }

    if (fromToPairs.length > 0) {
        window.kavenSkipTimer = setInterval(() => {
            if (skip-- > 0) {
                return;
            }

            fromToPairs.forEach(p => seek(p[0], p[1]))
        }, interval);
    }
}

skip([0, "01:28"], ["20:28", "21:56"]);