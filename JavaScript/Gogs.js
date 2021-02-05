/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/Gogs.js
 * @create:      2021-02-05 20:28:58.404
 * @modify:      2021-02-05 22:40:20.127
 * @version:     
 * @times:       5
 * @lines:       30
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function GogsTransferOwnership(new_owner_name) {
    $(`button[data-modal='#transfer-repo-modal']`).click();
    const repo_name = location.pathname.split('/')[2];
    // console.log(repo_name);
    $(`.dimmer #repo_name`).val(repo_name);
    $(`#new_owner_name`).val(new_owner_name);
    $(`.dimmer form`).submit();
}

GogsTransferOwnership(`Forked`);

const base = `https://kaven.xyz:3000`;
const first_href = $(`.ui.repository.list a`).first().attr('href');
const url = base + first_href;
return url;