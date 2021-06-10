/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/TFS.js
 * @create:      2021-06-10 10:39:48.020
 * @modify:      2021-06-10 10:39:48.020
 * @version:     
 * @times:       1
 * @lines:       9
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function GetChangesetString() {
    return $(".group-results:first").find(".change-info").map(function(){ return $(this).attr("title").split(" ")[0]; }).get().join(", ");
}

function CopyChangesetString() {
    const str = GetChangesetString();
    console.log(str);
    copy(str);
}