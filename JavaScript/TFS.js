/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/TFS.js
 * @create:      2021-06-10 10:39:48.020
 * @modify:      2022-01-06 17:07:06.997
 * @version:     
 * @times:       26
 * @lines:       130
 * @copyright:   Copyright © 2021-2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

function GetChangesets() {
    return $(".group-results:first").find(".change-info").map(function() { return $(this).attr("title").split(" ")[0]; }).get();
}

async function GetWorkItems(changeset) {
    // Retrieves the work items associated with a particular changeset.
    // https://docs.microsoft.com/en-us/rest/api/azure/devops/tfvc/changesets/get%20changeset%20work%20items?view=azure-devops-rest-6.0
    const url = new URL(location.href.replace("/_versionControl/", "/_apis/tfvc/"));
    url.pathname += `/${changeset}/workItems`;

    const r = await fetch(url);
    if (r.ok) {
        const j = await r.json();
        if (j.count > 0) {
            return j.value;
        }
    }

    return [];
}

async function GetChangeset(changeset) {
    // Retrieves the work items associated with a particular changeset.
    // https://docs.microsoft.com/en-us/rest/api/azure/devops/tfvc/changesets/get%20changeset%20work%20items?view=azure-devops-rest-6.0
    const url = new URL(location.href.replace("/_versionControl/", "/_apis/tfvc/"));
    url.pathname += `/${changeset}`;

    const r2 = await fetch(url);
    if (r2.ok) {
        const j2 = await r2.json();
        if (j2) {
            return j2.comment;
        }
    }

    return undefined;
}

async function GetChangesetComment(changeset) {
    return GetChangeset(changeset)?.comment;
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
    // console.log(changesets);

    const workItemChangesets = new Map();
    for (const changeset of changesets) {
        const items = await GetWorkItems(changeset);
        for (const item of items) {
            let key = item;
            for (const workItem of workItemChangesets.keys()) {
                if (workItem.id === item.id) {
                    key = workItem;
                    break;
                }
            }

            let set = workItemChangesets.get(key);
            if (!set) {
                set = new Set();
                workItemChangesets.set(item, set);
            }

            set.add(changeset);
        }
    }

    console.log(workItemChangesets);

    const lines = [];
    for (const [key, value] of workItemChangesets) {
        const workItem = key;
        lines.add(`${workItem.workItemType} ${workItem.id}: ${workItem.title}`);

        if (!onlyWorkItems) {
            continue;
        }

        if (value.length > 1) {
            for (const changeset of value) {
                const comment = await GetChangesetComment(changeset);
                if (comment) {
                    lines.add(comment);
                }
            }

            lines.add("\n");
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
    })();
}