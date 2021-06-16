/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/TFS.js
 * @create:      2021-06-10 10:39:48.020
 * @modify:      2021-06-16 19:51:31.728
 * @version:     
 * @times:       20
 * @lines:       77
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

async function GenerateDailyWorkReport(onlyWorkItems) {
    const changesets = GetChangesets();
    console.log(changesets);

    const lines = new Set();
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
                    lines.add(`${item.workItemType} ${item.id}: ${item.title}`);
                }
            } else {

                if (onlyWorkItems === true) {
                    continue;
                }

                url.pathname = url.pathname.substring(0, url.pathname.lastIndexOf("/workItems"));
                const r2 = await fetch(url);
                if (r2.ok) {
                    const j2 = await r2.json();
                    lines.add(j2.comment);
                }
            }
        }
    }

    lines.add("\n");
    lines.add(`变更集：${changesets.join(", ")}`);

    return Array.from(lines).join("\n");
}

function CopyDailyWorkReport(onlyWorkItems) {
    const _copy = copy;
    (async () => {
        const report = await GenerateDailyWorkReport(onlyWorkItems);
        console.log(report);
        _copy(report);
    })()
}