/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/bilibili.js
 * @create:      2021-06-05 10:33:40.467
 * @modify:      2021-06-14 19:01:06.805
 * @version:     
 * @times:       20
 * @lines:       173
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

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
                once: true
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

skip([0.1, "01:42"]);
// skip([0, "01:28"], ["20:28", "21:56"]);