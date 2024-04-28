/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/tfs.js
 * @create:      2021-06-10 10:39:48.020
 * @modify:      2024-04-28 17:43:41.838
 * @times:       50
 * @lines:       305
 * @copyright:   Copyright © 2021-2024 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/


function GetLatestPassedMonday() {
    // Get the current date
    const today = new Date();

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = today.getDay();

    // Calculate the offset to get to last Monday
    // If today is Monday, then the offset to get to last Monday is 7
    const daysSinceMonday = (currentDay + 6) % 7;

    // Calculate the date of the last Monday
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceMonday);

    console.log("Last Monday was:", lastMonday.toDateString());
    return lastMonday;
}

function SubtractDaysFromDate(originalDate, daysToSubtract) {
    const dateCopy = new Date(originalDate);
    dateCopy.setDate(dateCopy.getDate() - daysToSubtract);
    return dateCopy;
}

function GetProjectUrl() {
    const index = location.href.indexOf("/_versionControl/");
    if (index === -1) {
        return location.href;
    }

    return location.href.substring(0, index);
}

function GetAuthor() {
    return $("#mi_3 > span").text();
}

async function GetUserProfile() {
    const url = new URL(GetProjectUrl());
    url.pathname += "/_api/_common/GetUserProfile";

    const r = await fetch(url);
    if (r.ok) {
        return r.json();
    }

    return undefined;
}

async function GetUserEmail() {
    const profile = await GetUserProfile();
    return profile?.userPreferences?.PreferredEmail;
}

function GetChangesets() {
    return $(".group-results:first").find(".change-info").map(function() { return $(this).attr("title").split(" ")[0]; }).get();
}

// GET the changesets filtered by author.
// https://learn.microsoft.com/en-us/rest/api/azure/devops/tfvc/changesets/get-changesets?view=azure-devops-rest-6.0&tabs=HTTP#get-the-changesets-filtered-by-author.

// https://learn.microsoft.com/en-us/rest/api/azure/devops/tfvc/changesets/get-changesets?view=azure-devops-rest-6.0&tabs=HTTP#get-the-changesets-for-a-range-of-dates.
// GET the changesets for a range of dates.

async function GetChangesetsByAuthor(author, fromDate, toDate) {
    const url = new URL(GetProjectUrl());
    url.pathname += "/_apis/tfvc/changesets";

    if (!author) {
        author = GetAuthor(); // await GetUserEmail();
    }

    if (!fromDate) {
        const latestMonday = GetLatestPassedMonday();

        // Set the time to midnight
        latestMonday.setHours(0, 0, 0, 0);

        fromDate = latestMonday;
    }

    if (!toDate) {
        toDate = new Date();
    }

    const searchParams = new URLSearchParams();
    searchParams.set("searchCriteria.author", author);
    searchParams.set("searchCriteria.fromDate", fromDate instanceof Date ? fromDate.toISOString() : fromDate);
    searchParams.set("searchCriteria.toDate", toDate instanceof Date ? toDate.toISOString() : toDate);
    url.search = `?${searchParams}`;

    const r = await fetch(url);
    if (r.ok) {
        const j = await r.json();
        if (j.count > 0) {
            return j.value;
        }
    }

    return [];
}

async function GetMyChangesets(days) {
    if (days === undefined) {
        return await GetChangesetsByAuthor();
    }

    const date = new Date();

    const fromDate = SubtractDaysFromDate(date, days);
    return await GetChangesetsByAuthor(undefined, fromDate, date);
}

async function GetWorkItems(changeset) {
    // Retrieves the work items associated with a particular changeset.
    // https://docs.microsoft.com/en-us/rest/api/azure/devops/tfvc/changesets/get%20changeset%20work%20items?view=azure-devops-rest-6.0
    const url = new URL(GetProjectUrl());
    url.pathname += `/_apis/tfvc/changesets/${changeset}/workItems`;

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
    const url = new URL(GetProjectUrl());
    url.pathname += `/_apis/tfvc/changesets/${changeset}`;

    const r2 = await fetch(url);
    if (r2.ok) {
        const j2 = await r2.json();
        return j2;
    }

    return undefined;
}

async function GetChangesetComment(changeset) {
    return (await GetChangeset(changeset))?.comment;
}

function GetChangesetString() {
    return GetChangesets().join(", ");
}

function CopyChangesetString() {
    const str = GetChangesetString();
    console.log(str);
    copy(str);
}

async function GenerateWorkReport(changesets, ignoreChangesetComment) {
    const workItemChangesets = new Map();
    const independentChangesets = [];
    for (const changeset of changesets) {
        const items = await GetWorkItems(changeset);
        if (items.length === 0) {
            // not linking any work items
            independentChangesets.push(changeset);
            continue;
        }

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

    const addChangesetComment = async (changeset) => {
        const comment = await GetChangesetComment(changeset);
        if (comment) {
            lines.push(comment);
            lines.push("\n");
        }
    };

    for (const [key, value] of workItemChangesets) {
        const workItem = key;

        if (value.size > 1 && lines.length > 0 && lines[lines.length - 1] !== "\n") {
            lines.push("\n");
        }

        lines.push(`${workItem.workItemType} ${workItem.id}: ${workItem.title}`);
        lines.push("\n");

        if (ignoreChangesetComment) {
            continue;
        }

        if (value.size > 1) {
            for (const changeset of value) {
                await addChangesetComment(changeset);
            }

            lines.push("\n");
        }
    }

    for (const changeset of independentChangesets) {
        await addChangesetComment(changeset);
    }

    lines.push("\n");
    lines.push(`变更集：${changesets.join(", ")}`);

    return lines.join("");
}

async function GenerateDailyWorkReport(ignoreChangesetComment) {
    const changesets = GetChangesets();
    return GenerateWorkReport(changesets, ignoreChangesetComment);
}

async function GenerateWorkReportByDays(days, ignoreChangesetComment) {
    const changesets = await GetMyChangesets(days);
    return GenerateWorkReport(changesets.map(p => p.changesetId), ignoreChangesetComment);
}

function CopyDailyWorkReport(onlyWorkItems) {
    const _copy = copy;
    (async () => {
        const report = await GenerateDailyWorkReport(onlyWorkItems);
        console.log(report);
        _copy(report);
    })();
}

function CopyWorkReportByDays(days, onlyWorkItems) {
    const _copy = copy;
    (async () => {
        const report = await GenerateWorkReportByDays(days, onlyWorkItems);
        console.log(report);
        _copy(report);
    })();
}

function formatDate(date) {
    // Get date components
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // Month is zero-based, so add 1
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Ensure two-digit formatting for day, month, hours, minutes, and seconds
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    // Concatenate the components to form the formatted date string
    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    
    return formattedDate;
}

async function ListChangesets() {
    const items = await GetChangesetsByAuthor();  
    return items.map(p => `${p.changesetId}    ${p.author.displayName}    ${formatDate(new Date(p.createdDate))}    ${p.comment}`);
}
