/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/AGE_DPlayer.js
 * @create:      2022-01-10 17:49:05.470
 * @modify:      2022-01-10 17:53:58.331
 * @version:     
 * @times:       5
 * @lines:       252
 * @copyright:   Copyright © 2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

// https://greasyfork.org/en/scripts/430915-age%E5%8A%A8%E6%BC%AB%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E6%89%A9%E5%B1%95/code

function hide_info() {
    document.querySelector("body > div.wrap > div:nth-child(3)").style.display = "none";
    document.querySelector("body > div.wrap > div.playding.mb.clearfix").style.display = "none";
}

function add_zhougen() {
    const father = document.querySelector("body > div.topall > div > ul.ls");
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "ls1";
    a.innerText = "周更";
    a.href = "http://www.agefans.top/zhougen/";
    li.appendChild(a);
    li.className = "js1";
    father.appendChild(li);
}

function review_history() {
    const history_view = document.querySelector("body > div.topall > div > ul.ls > li > div");
    history_view.style.width = "400px";
    //历史记录更改到具体集数
    const btn = document.querySelector("body > div.topall > div > ul.ls > li > a");
    btn.onmouseover = function() {
        //每次会重新从cookie中加载，所以这里重新定义事件
        const his = document.querySelector("body > div.topall > div > ul.ls > li > div");
        his.style.display = "block";
    };
    const video_history = document.querySelectorAll("#mh-ul > ul > li > a");
    for (let i = 0; i < video_history.length; i++) {
        const item = video_history[i];

        const super_url_start = item.href.lastIndexOf("acg");
        const super_url_end = item.href.lastIndexOf("/");
        const super_url = item.href.slice(super_url_start, super_url_end);

        const now_url = localStorage.getItem(super_url);
        if (now_url)
            item.href = now_url;
    }
}

function set_history() {
    const super_url_start = location.href.lastIndexOf("acg");
    const super_url_end = location.href.lastIndexOf("/");
    const super_url = location.href.slice(super_url_start, super_url_end);
    localStorage.setItem(super_url, location.href);
}

function handle_cata() {

    //获取动漫的目录列表元素
    const list = document.querySelectorAll("#stab_1_71  ul > li > a");
    //下一集按钮
    const ul = document.querySelector("body > div.wrap > div.taba-down.mb.clearfix > div.pfromd.tab0.clearfix > ul");
    const li = document.createElement("li");
    ul.appendChild(li);
    li.innerText = "下一集";
    li.onclick = () => {
        let index;
        for (let i = 0; i < list.length; i++) {
            //定位当前正在播放的是哪一个
            if (location.href == list[i].href) {
                index = i;
                break;
            }
        }
        console.log("集数" + index);
        if (index < 1) {
            return;
        }
        list[index - 1].click();
        console.log("集数" + index);
    };
    /*     //修改播放历史，记录当前播放集
    let cookie = document.cookie
 
        console.log(typeof( HISTORY));
    let super_url_index = location.href.lastIndexOf('/')
    let super_url = location.href.slice(0, super_url_index)
    let start_index = cookie.indexOf(super_url)
    console.log(start_index)
    let end_index = cookie.indexOf('\"',start_index)
    let now_cookie = cookie.slice(0,start_index) + location.href + cookie.slice(end_index)
    document.cookie = now_cookie
    console.log(document.cookie); */

    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        item.parentNode.style.width = "auto";
        item.parentNode.style["min-width"] = "90px";
        const text = item.innerText;
        const url = item.href;
        const now_time = localStorage.getItem(url);
        if (now_time)
            item.innerText = text + "(已看" + Math.round(now_time / 60) + "分钟)";

        /*         //去除全部备用
        if(text.indexOf('备用')!=-1){
            list.splice(i,1);
            continue
        } */
        //点击时存储到历史记录
        /*         list[i].onclick = function(){
            let start_index = cookie.indexOf(super_url)
            console.log(start_index)
            if(start_index != -1){
                let end_index = cookie.indexOf('\"',start_index)
                let now_cookie = cookie.slice(0,start_index) + url + cookie.slice(end_index)
                document.cookie = now_cookie
            }
        } */
    }
}

function handle_video() {
    //获取动漫的目录列表元素
    const list = document.querySelectorAll("#stab_1_71  ul > li > a");

    const test = document.querySelector("#playiframe");
    console.log(test);
    const video_src = decodeURIComponent(test.src);
    const start = video_src.search("vid=") + 4;
    const end = video_src.indexOf("&");
    const src = video_src.slice(start, end);
    console.log(src);
    /*     if(src.indexOf('.mp4') == -1){
        return
    } */

    //注入video标签

    //引入script及css       1.9.1的最新版有问题，不断跳出错误
    /*     let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = "https://cdn.bootcdn.net/ajax/libs/dplayer/1.25.0/DPlayer.min.js";
    document.documentElement.appendChild(script); */

    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.href = "https://cdn.bootcdn.net/ajax/libs/dplayer/1.25.0/DPlayer.min.css";
    document.documentElement.appendChild(link);

    const video_ele = document.createElement("div");
    video_ele.style.height = "100%";
    video_ele.style.width = "auto";
    video_ele.id = "lin_player";

    //视频播放器
    const player = document.querySelector("#player");
    player.appendChild(video_ele);
    test.remove();

    //注入播放器
    const dp = new DPlayer({
        container: document.getElementById("lin_player"),
        autoplay: true,
        video: {
            url: src,
        },
    });
    
    //如果视频播放失败，还原
    dp.on("error", () => {
        player.appendChild(test);
        video_ele.remove();
    });

    //跳转到历史位置
    const to_time = localStorage.getItem(location.href);
    dp.seek(to_time);

    //播放结束后自动下一个
    dp.on("ended", () => {
        console.log("video end");
        let index;
        for (let i = 0; i < list.length; i++) {
            //定位当前正在播放的是哪一个
            if (location.href == list[i].href) {
                index = i;
                break;
            }
        }
        if (index < 1) {
            return;
        }

        dp.notice("即将播放下一集", 3000);
        //倒计时
        const timeout = setTimeout(function() {
            clearTimeout(timeout);
            list[index--].click();
            //             location.assign(list[index-1].href)
        }, 3000);
    });

    //记录播放进度
    dp.on("timeupdate", () => {
        const current = dp.video.currentTime;
        //         console.log(current,location.href)
        localStorage.setItem(location.href, current);
    });
    /*     setInterval(function(){
        let current = dp.video.currentTime
        console.log(current,location.href)
        localStorage.setItem(location.href,current)
    }, 5000) */

}

function main() {
    review_history();
    add_zhougen();

    if (location.href.indexOf("acg") != -1) {
        handle_cata();
    }
    if (location.href.indexOf(".html") != -1) {
        set_history();
        handle_video();
        hide_info();
    }
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