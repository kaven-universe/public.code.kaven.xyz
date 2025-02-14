/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /ts/MIME.ts
 * @create:      2025-02-14 16:25:55.750
 * @modify:      2025-02-14 17:20:45.176
 * @times:       19
 * @lines:       123
 * @copyright:   Copyright © 2025 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import { CombinePath, FilePath, HttpStandardRequestHeader_UserAgent } from "kaven-basic";
import { GetFileContent, IsPathExistSync, KavenRequest, SaveJsonConfig, SaveStringToFile } from "kaven-utils";
import * as cheerio from "cheerio";

import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = new FilePath(__dirname, "MIME", "html");
let html = "";

if (IsPathExistSync(filePath.Path)) {
    console.info("The file already exists.");
    html = await GetFileContent(filePath.Path);
} else {
    const request = new KavenRequest("https://www.iana.org/assignments/media-types/media-types.xhtml");
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

interface TableData {
    [key: string]: string; // Each row in the table will be a key-value pair where key is column name
}
  
// Function to parse HTML table and convert to JSON
function parseTablesToJson(): Record<string, TableData[]> {
    // Load HTML into cheerio
    const $ = cheerio.load(html);
  
    // This will hold the tables' data in a dictionary (key: table id, value: table data)
    const tablesData: Record<string, TableData[]> = {};
  
    // Find all the tables in the document
    $("table").each((_, tableElement) => {
        const table = $(tableElement);
        const tableId = table.attr("id");

        if (!tableId) {
            console.info("Ignore table without id.");
            return;
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

const tablesJson = parseTablesToJson();

type IMIME = {
    name: string;
    template: string;
};

const mime: IMIME[] = [];

for (const table in tablesJson) {
    for (const row of tablesJson[table]) {
        const name = row["Name"];
        const template = row["Template"];
        if (name && template) {
            const exists = mime.find(m => m.name === name);
            if (exists) {
                if (exists.template === template) {
                    continue;
                } else {
                    console.warn("Duplicated MIME type: ", row);
                }
            }

            mime.push({ name, template });            
        } else {
            console.warn("Invalid MIME type: ", row);
        }
    }
}

const savedPath = await SaveJsonConfig(mime, resolve(__dirname, "../../public.data.kaven.xyz/json/MIME.json"));
console.info("MIME.json saved to: ", savedPath);
