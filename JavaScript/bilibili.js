/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/bilibili.js
 * @create:      2021-06-05 10:33:40.467
 * @modify:      2021-07-09 21:48:37.853
 * @version:     
 * @times:       52
 * @lines:       306
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function cnNow() {
    const today = new Date();
    const chinese = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const y = today.getFullYear().toString();
    const m = (today.getMonth() + 1).toString();
    const d = today.getDate().toString();
    let result = "";
    for (let i = 0; i < y.length; i++) {
        result += chinese[y.charAt(i)];
    }
    result += "年";
    if (m.length == 2) {
        if (m.charAt(0) == "1") {
            result += ("十" + chinese[m.charAt(1)] + "月");
        }
    }
    else {
        result += (chinese[m.charAt(0)] + "月");
    }
    if (d.length == 2) {
        result += (chinese[d.charAt(0)] + "十" + chinese[d.charAt(1)] + "日");
    }
    else {
        result += (chinese[d.charAt(0)] + "日");
    }

    return result;
}

function cnWeek() {
    const d = new Date();
    const weekday = new Array(7);
    weekday[0] = "周日"; //"Sunday";
    weekday[1] = "周一"; //"Monday";
    weekday[2] = "周二"; //"Tuesday";
    weekday[3] = "周三"; //"Wednesday";
    weekday[4] = "周四"; //"Thursday";
    weekday[5] = "周五"; //"Friday";
    weekday[6] = "周六"; //"Saturday";

    const n = weekday[d.getDay()];

    return n;
}

function send() {
    setTimeout(() => {
        const input = document.querySelector("#bilibiliPlayer > div.bilibili-player-area.progress-shadow-show > div.bilibili-player-video-bottom-area > div > div.bilibili-player-video-danmaku-root > div.bilibili-player-video-inputbar.focus > div > input");
        if (input) {
            input.value = `${cnNow()} ${cnWeek()} ${new Date().toLocaleTimeString()}`;
            const e = new Event("input");
            e.myself = true;
            input.dispatchEvent(e);

            setTimeout(() => {
                const sendButton = document.querySelector("#bilibiliPlayer > div.bilibili-player-area.progress-shadow-show > div.bilibili-player-video-bottom-area > div > div.bilibili-player-video-danmaku-root > div.bilibili-player-video-inputbar.focus > button");
                if (sendButton) {
                    // sendButton.click();
                    const e = new Event("click");
                    e.myself = true;
                    sendButton.dispatchEvent(e);
                }
            }, 5000);
        }
    }, 5000);
}

/*
    VIDEO_MEDIA_ENTER: "video_media_enter",
    VIDEO_MEDIA_PLAY: "video_media_play",
    VIDEO_MEDIA_PLAYING: "video_media_playing",
    VIDEO_MEDIA_CANPLAY: "video_media_canplay",
    VIDEO_MEDIA_PAUSE: "video_media_pause",
    VIDEO_MEDIA_SEEK: "video_media_seek",
    VIDEO_MEDIA_SEEKING: "video_media_seeking",
    VIDEO_MEDIA_SEEKED: "video_media_seeked",
    VIDEO_MEDIA_SEEK_END: "video_media_seek_end",
    VIDEO_MEDIA_TIME: "video_media_time",
    VIDEO_MEDIA_FRAME: "video_media_frame",
    VIDEO_MEDIA_ERROR: "video_media_error",
    VIDEO_MEDIA_BUFFER: "video_media_buffer",
    VIDEO_MEDIA_BUFFER_END: "video_media_buffer_end",
    VIDEO_MEDIA_BUFFER_FULL: "video_media_buffer_full",
    VIDEO_MEDIA_LOADLAG: "video_media_loadlag",
    VIDEO_MEDIA_ENDED: "video_media_ended",
    VIDEO_MEDIA_VOLUME: "video_media_volume",
    VIDEO_MEDIA_MUTE: "video_media_mute",
    VIDEO_MEDIA_ATTACHED: "video_media_attached",
    VIDEO_PLAYER_LOAD: "video_player_load",
    VIDEO_PLAYER_LOADED: "video_player_loaded",
    VIDEO_PLAYURL_LOAD: "video_playurl_load",
    VIDEO_PLAYURL_LOADED: "video_playurl_loaded",
    VIDEO_METADATA_LOAD: "video_media_load",
    VIDEO_METADATA_LOADED: "video_media_loaded",
    VIDEO_DANMAKU_LOAD: "video_danmaku_load",
    VIDEO_DANMAKU_LOADED: "video_danmaku_loaded",
    VIDEO_PAGELIST_LOADED: "video_pagelist_loaded",
    VIDEO_WEBSOCKET_LINK: "video_websocket_link",
    VIDEO_WEBSOCKET_LINKED: "video_websocket_linked",
    VIDEO_WEBSOCKET_ERROR: "video_websocket_error",
    VIDEO_WEBSOCKET_END: "video_websocket_end",
    VIDEO_INITIALIZING: "video_initializing",
    VIDEO_INITIALIZED: "video_initialized",
    VIDEO_SCROLL: "video_scroll",
    VIDEO_RESIZE: "video_resize",
    VIDEO_PLAYER_RESIZE: "video_player_resize",
    VIDEO_PROGRESSBAR_RESIZE: "video_progressbar_resize",
    VIDEO_REFULLSCREEN: "video_refullscreen",
    VIDEO_FULLSCREEN_MODE_CHANGED: "video_fullscreen_mode_changed",
    VIDEO_MOUSEMOVE: "video_mousemove",
    VIDEO_HEARTBEAT: "video_heartbeat",
    VIDEO_CONTROLBAR: "video_controlbar",
    VIDEO_PROGRESS_UPDATE: "video_progress_update",
    VIDEO_BEFORE_DESTROY: "video_before_destroy",
    VIDEO_DESTROY: "video_destroy",
    VIDEO_LOG: "video_log",
    VIDEO_LOG_UPDATE: "video_log_update",
    VIDEO_LOG_CLOSE: "video_log_close",
    VIDEO_PROMOTE_INIT: "video_promote_init",
    VIDEO_PRELOAD_ERROR: "video_preload_error",
    VIDEO_SUBTITLE_CHANGE: "video_subtitle_change",
    VIDEO_PANEL_HOVER: "video_panel_hover",
    VIDEO_GUIDE_ATTENTION_POS_UPDATE: "video_guide_attention_pos_update",
    VIDEO_MIRROR: "video_mirror",
    VIDEO_SIZE_RESIZE: "video_size_resize",
    VIDEO_STATE_CHANGE: "video_state_change",
    DASH_PLAYER_ERROR: "dash_player_error",
    INTERACTIVE_VIDEO_ENDED: "interactive_video_ended",
    INTERACTIVE_VIDEO_COUNTDOWN_START: "interactive_video_countdown_start",
    PLAYER_RELOAD: "player_reload",
    PLAYER_RELOADED: "player_reloaded",
    PLAYER_SEND: "player_send"
*/

function skip(...fromToPairs) {

    const options = {
        interval: 1000, // ms
        skip: false,
        currentTime: undefined,
        player: undefined,
    };

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

        if (options.currentTime >= fromSeconds && options.currentTime < toSeconds) {
            console.log(`seek from ${from} to ${to}, ${fromSeconds} -> ${toSeconds}`);
            options.skip = true;
            window.player.addEventListener("video_media_seek_end", () => options.skip = false, {
                capture: false,
                once: true,
            });
            return window.player.seek(toSeconds);
        }
    }

    if (window.kavenSkipTimer) {
        clearInterval(window.kavenSkipTimer);
        window.kavenSkipTimer = undefined;
    }

    if (fromToPairs.length > 0) {
        window.kavenSkipTimer = setInterval(() => {
            try {
                if (!window.player) {
                    console.warn("window.player is ", window.player);
                    return;
                }

                if (options.player !== window.player) {
                    console.log("player changed");
                    options.player = window.player;
                    return;
                }

                if (options.skip) {
                    return;
                }

                options.currentTime = window.player.getCurrentTime();

                fromToPairs.forEach(p => seek(p[0], p[1]));
            } catch (ex) {
                console.error(ex);
            }
        }, options.interval);
    }
}

function getName() {
    return document.querySelector("#media_module > div > a")?.text;
}

function main() {

    let name = getName();

    setInterval(() => {
        const newName = getName();

        if (name !== newName) {
            name = newName;
            console.log(`play new: ${name}`);
            send();
        }
    }, 5000);

    send();

    if (name?.includes("名侦探柯南")) {
        const selectors = [
            "head > title",
            "#bilibiliPlayer > div.bilibili-player-area.progress-shadow-show > div.bilibili-player-video-wrap > div.bilibili-player-video-top.bilibili-player-video-top-pgc > div.bilibili-player-video-top-title",
            "#bilibiliPlayer > div.bilibili-player-area.video-state-pause.progress-shadow-show > div.bilibili-player-video-wrap > div.bilibili-player-video-control-wrap > div.bilibili-player-video-control > div.bilibili-player-video-control-bottom > div.bilibili-player-video-control-bottom-right > div.bilibili-player-video-btn.bilibili-player-video-btn-pagelist.bilibili-player-show > div > ul > li.bilibili-player-video-btn-menu-list.bilibili-player-active.bilibili-player-blink",
            "#app > div.plp-l > div.media-wrapper > h1",
            "#eplist_module > div.list-wrapper.longlist > ul > li.ep-item.cursor.visited > span",
        ];

        let name;

        for (const s of selectors) {
            name = document.querySelector(s)?.textContent;
            if (name) {
                break;
            }
        }

        if (name) {
            console.log("play: ", name);

            const index = parseInt(name.replace(/\D/g, ""));

            if (index >= 600) {
                skip(["01:50", "03:45"]);
                return;
            }

            if (index >= 319) {
                skip([0.1, "01:52"]);
                return;
            }
        }

        skip([0.1, "01:42"]);
        // skip([0, "01:28"], ["20:28", "21:56"]);
    }
}

const i = setInterval(() => {
    if (document.readyState === "complete") {
        clearInterval(i);

        main();
    }
}, 1000);

