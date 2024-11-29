/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /mjs/AzureDevOps.mjs
 * @create:      2024-11-29 11:14:04.485
 * @modify:      2024-11-29 13:09:46.311
 * @times:       4
 * @lines:       92
 * @copyright:   Copyright © 2024 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import axios from "axios";
import { CombinePath, GetFileNameWithoutExtension } from "kaven-basic";
import { LoadJsonConfig, SaveJsonConfig } from "kaven-utils";
import moment from "moment";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const __dirname = dirname(__filename);

/**
 * Fetches all pushes from Azure DevOps for the current week.
 * 
 * @param {string} organization - The Azure DevOps organization name.
 * @param {string} project - The Azure DevOps project name.
 * @param {string} repository - The repository name or ID.
 * @param {string} pat - Personal Access Token for authentication.
 * @returns {Promise<void>} - Logs the pushes or any errors.
 */
async function getWeeklyPushes(organization, project, repository, pat) {
    try {
        // Calculate start and end dates for the current week (UTC)
        const startOfWeek = moment().utc().startOf("isoWeek").toISOString();  // ISO week starts on Monday
        const endOfWeek = moment().utc().endOf("isoWeek").toISOString();

        // Azure DevOps API endpoint
        const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pushes?api-version=7.1-preview.2&searchCriteria.fromDate=${startOfWeek}&searchCriteria.toDate=${endOfWeek}`;

        // Base64 encode the PAT for basic auth
        const auth = Buffer.from(`:${pat}`).toString("base64");

        // Make the request
        const response = await axios.get(url, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        });

        // Process and log the pushes
        const pushes = response.data.value;
        if (pushes.length === 0) {
            console.log("No pushes this week.");
        } else {
            console.log("Pushes this week:");
            pushes.forEach(push => {
                console.log(`Push by ${push.pushedBy.displayName} on ${push.date}`);
            });
        }
    } catch (error) {
        console.error("Error fetching pushes:", error.response ? error.response.data : error.message);
    }
}

async function run() {
    const name = GetFileNameWithoutExtension(__filename) + ".config.json";
    let setting = await LoadJsonConfig(__dirname, name);
    if (!setting) {
        setting = {
            organization: "your-organization",
            project: "your-project",
            repository: "your-repository",
            pat: "your-personal-access-token",  // Replace with your actual PAT
        };

        const file = await SaveJsonConfig(setting, CombinePath(__dirname, name));
        console.info(`Generate file: ${file}`);
        return;
    }

    await getWeeklyPushes(setting.organization, setting.project, setting.repository, setting.pat);
}

run().catch(ex => console.error(ex));
