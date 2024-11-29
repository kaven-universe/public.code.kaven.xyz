/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/azurue.js
 * @create:      2024-11-29 14:24:06.215
 * @modify:      2024-11-29 15:03:49.334
 * @times:       4
 * @lines:       67
 * @copyright:   Copyright © 2024 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

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

function getPushes() {
    const lines = [];

    const selector = "#skip-to-main-content > div > div.page-content.page-content-top.flex-column.flex-grow.flex-noshrink.rhythm-vertical-16 > div > div > div > table > tbody tr.bolt-tree-row:not(.bolt-list-row-no-hover)";
    const rows = document.querySelectorAll(selector);

    for (const row of rows) {
        const thirdTd = row.querySelectorAll("td")[2]; // 0-based index for third <td>
        if (thirdTd) {
            const name = thirdTd.querySelector("div > div > a")?.text;
            if (!name) {
                continue;
            }

            const second = thirdTd.querySelector("div:nth-of-type(2) > div");
            if (!second) {
                continue;
            }

            const hash = second.querySelector("div")?.textContent;
            const user = second.querySelector("span")?.textContent;
            const date = second.querySelector("span > time")?.getAttribute("datetime");

            const line = [hash, formatDate(new Date(date)), user, name].join("    ");
            lines.push(line);
        }
    }

    return lines;
}
