/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /ts/MIME.ts
 * @create:      2025-02-14 16:25:55.750
 * @modify:      2025-02-17 15:50:01.884
 * @times:       22
 * @lines:       171
 * @copyright:   Copyright © 2025 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import { CombinePath, FilePath, HttpStandardRequestHeader_UserAgent } from "kaven-basic";
import { GetFileContent, IsPathExistSync, KavenRequest, MakeDirectoryIfNotExists, SaveJsonConfig, SaveStringToFile } from "kaven-utils";
import * as cheerio from "cheerio";

import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getHtml(url: string, name: string) {
    const cachePath = await MakeDirectoryIfNotExists(CombinePath(__dirname, "cache"));
    const filePath = new FilePath(cachePath, name, "html");
    let html = "";

    if (IsPathExistSync(filePath.Path)) {
        console.info("The file already exists.");
        html = await GetFileContent(filePath.Path);
    } else {
        const request = new KavenRequest(url);
        request.UpdateHeader(HttpStandardRequestHeader_UserAgent, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");

        const response = await request.Execute();
        if (response.IsSuccess && response.Text) {
            html = response.Text;
            await SaveStringToFile(response.Text, filePath.Path);
        } else {
            console.warn(response.StatusText);
            console.warn(response.Text);
        }
    }

    return html;
}

interface TableData {
    [key: string]: string; // Each row in the table will be a key-value pair where key is column name
}

// Function to parse HTML table and convert to JSON
function parseTablesToJson(html: string, checkTableId = false): Record<string, TableData[]> {
    // Load HTML into cheerio
    const $ = cheerio.load(html);

    // This will hold the tables' data in a dictionary (key: table id, value: table data)
    const tablesData: Record<string, TableData[]> = {};

    let tableIndex = 0;

    // Find all the tables in the document
    $("table").each((_, tableElement) => {
        const table = $(tableElement);
        let tableId = table.attr("id");

        if (!tableId) {
            if (checkTableId) {
                return;
            } else {
                tableId = `table_${Date.now()}_${tableIndex++}`;
            }
        }

        const headers: string[] = [];
        const data: TableData[] = [];

        // Extract headers from the table
        table.find("thead th").each((_, th) => {
            headers.push($(th).text().trim());
        });

        // Extract rows from the table
        table.find("tbody tr").each((_, tr) => {
            const rowData: TableData = {};
            $(tr).find("td").each((index, td) => {
                rowData[headers[index]] = $(td).text().trim();
            });
            data.push(rowData);
        });

        // Save the table data with its id as key
        tablesData[tableId] = data;
    });

    return tablesData;
}

const Common_MIME_types = await getHtml("https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types", "Common_MIME_types");
const Full_MIME_types = await getHtml("https://www.iana.org/assignments/media-types/media-types.xhtml", "Full_MIME_types");

const tablesJsonCommon = parseTablesToJson(Common_MIME_types);
const tablesJsonFull = parseTablesToJson(Full_MIME_types, true);

type tMIME = {
    extension: string;
    types: string[];
};

const mime: tMIME[] = [];

function getMIME(extension: string) {
    extension = extension.trim().toLowerCase();

    if (!extension.startsWith(".")) {
        extension = "." + extension;
    }

    const exists = mime.find(m => m.extension === extension);
    if (exists) {
        return exists;
    }

    const newMIME: tMIME = { extension, types: [] };
    mime.push(newMIME);
    return newMIME;
}

function addMIME(extension: string, type: string) {
    const m = getMIME(extension);
    if (!m.types.includes(type)) {
        m.types.push(type);
    }
}

for (const table in tablesJsonCommon) {
    for (const row of tablesJsonCommon[table]) {
        const names = row["Extension"].split(",");

        const value = row["MIME Type"];
        if (!value) {
            continue;
        }

        for (const name of names) {
            if (name) {
                addMIME(name, value);
            } else {
                console.warn("Invalid MIME type: ", row);
            }
        }        
    }
}

for (const table in tablesJsonFull) {
    for (const row of tablesJsonFull[table]) {
        const name = row["Name"];
        const value = row["Template"];
        if (name && value) {
            addMIME(name, value);
        } else {
            console.warn("Invalid MIME type: ", row);
        }
    }
}

const savedPath = await SaveJsonConfig(mime, resolve(__dirname, "../../public.data.kaven.xyz/json/MIME.json"));
console.info("MIME.json saved to: ", savedPath);
