/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/Gogs.js
 * @create:      2021-02-05 20:28:58.404
 * @modify:      2021-02-05 20:42:40.557
 * @version:     
 * @times:       4
 * @lines:       26
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function GogsTransferOwnership(new_owner_name) {
    $("button[data-modal='#transfer-repo-modal']").click();
    const repo_name = location.pathname.split('/')[2];
    // console.log(repo_name);
    $(".dimmer #repo_name").val(repo_name);
    $("#new_owner_name").val(new_owner_name);
    $(".dimmer form").submit();
}

GogsTransferOwnership("Forked");
