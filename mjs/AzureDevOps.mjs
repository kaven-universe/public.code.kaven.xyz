/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /mjs/AzureDevOps.mjs
 * @create:      2024-11-29 11:14:04.485
 * @modify:      2024-11-29 14:10:46.869
 * @times:       11
 * @lines:       127
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
        const startOfWeek = moment().utc().startOf("isoWeek").toISOString();
        const endOfWeek = moment().utc().endOf("isoWeek").toISOString();
    
        // Azure DevOps API endpoint to get all pushes
        const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pushes?api-version=7.1-preview.2&searchCriteria.fromDate=${startOfWeek}&searchCriteria.toDate=${endOfWeek}`;
        
        // Base64 encode the PAT for basic auth
        const auth = Buffer.from(`:${pat}`).toString("base64");
    
        // Initialize variables for pagination
        let allPushes = [];
        let skip = 0;
        const top = 100; // Number of pushes per page
    
        while (true) {
            // Make the API call to get pushes with $top and $skip for pagination
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/json",
                },
                params: {
                    $top: top,   // Limit the number of results per page
                    $skip: skip, // Skip the number of results already fetched
                },
            });
    
            allPushes = allPushes.concat(response.data.value);
    
            // If the number of pushes returned in the original response is less than $top, we are done
            if (response.data.value.length < top) {
                break;
            }
    
            // Increment skip for the next page
            skip += top;
        }

        if (allPushes.length === 0) {
            console.warn("No pushes");
            return;
        }

        // Get the user info from Azure DevOps API to retrieve the user's ID
        const userInfoResponse = await axios.get(
            `https://dev.azure.com/${organization}/_apis/connectionData?api-version=7.1-preview.1`,
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`:${pat}`).toString("base64")}`,
                    "Content-Type": "application/json",
                },
            },
        );
    
        const userId = userInfoResponse.data.authenticatedUser.id; // Get the ID of the authenticated user
        const tokenUserPushes = allPushes.filter(push =>
            push.pushedBy.id === userId,
        );

        console.info(tokenUserPushes);

        // TODO
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
