/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/TFS.js
 * @create:      2021-06-10 10:39:48.020
 * @modify:      2021-06-16 19:20:40.096
 * @version:     
 * @times:       7
 * @lines:       62
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function GetChangesets() {
    return $(".group-results:first").find(".change-info").map(function () { return $(this).attr("title").split(" ")[0]; }).get();
}

function GetChangesetString() {
    return GetChangesets().join(", ");
}

function CopyChangesetString() {
    const str = GetChangesetString();
    console.log(str);
    copy(str);
}

async function GenerateDailyWorkReport() {
    const changesets = GetChangesets();
    console.log(changesets);
    
    const lines = [];
    for (const changeset of changesets) {
        // Retrieves the work items associated with a particular changeset.
        // https://docs.microsoft.com/en-us/rest/api/azure/devops/tfvc/changesets/get%20changeset%20work%20items?view=azure-devops-rest-6.0
        const url = new URL(location.href.replace("/_versionControl/", "/_apis/tfvc/"));
        url.pathname += `/${changeset}/workItems`;

        const r = await fetch(url);
        if (r.ok) {
            const j = await r.json();
            if (j.count > 0) {
                for (const item of j.value) {
                    lines.push(`${j.workItemType} ${j.id}: ${j.title}`);
                }
            } else {
                // TODO: maybe add changeset comment
            }
        }
    }

    return lines.join("\n");
}

function CopyDailyWorkReport() {
    GenerateDailyWorkReport().then(report => {
        console.log(report);
        copy(report);
    });
}