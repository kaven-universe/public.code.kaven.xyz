/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /mjs/proxy.mjs
 * @create:      2023-12-28 15:37:23.256
 * @modify:      2023-12-28 18:02:07.072
 * @times:       10
 * @lines:       77
 * @copyright:   Copyright © 2023 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import { Distinct, Sleep, SplitStringByNewline } from "kaven-basic";
import { HttpTryGetText, SaveJsonConfig } from "kaven-utils";
import { createConnection } from "node:net";

const proxies = [];

async function add(host, port, type, tags) {
    const socket = createConnection(port, host);

    // Event: Connection established
    socket.on('connect', () => {
        console.log(`TCP server at ${host}:${port} is available.`);
        socket.end(); // Close the connection after testing

        if (typeof tags === "string") {
            tags = [tags];
        } else if (!Array.isArray(tags)) {
            tags = [];
        }

        proxies.push({
            "Type": type,
            "Host": host,
            "Port": Number(port),
            "Tags": Distinct(tags),
            "UserName": null,
            "Password": null,
            "IgnoreServerCertificateVerification": false
        });
    });

    // Event: Connection error
    socket.on('error', (err) => {
        console.error(`Error connecting to TCP server: ${err.message}`);
    });

    // Event: Connection timeout
    socket.on('timeout', () => {
        console.error(`Connection to TCP server timed out.`);
        socket.destroy(); // Destroy the socket explicitly to ensure it is closed
    });

    // Set a timeout for the connection attempt
    socket.setTimeout(1000);
}

async function addSocks5ProxyFromUrl(url) {
    const data = await HttpTryGetText(url);
    const lines = SplitStringByNewline(data);
    if (lines && lines.length > 0) {
        for (const line of lines) {
            const [hostPort, ...tags] = line.split("|")
            const [host, port] = hostPort.split(":");
            add(host, port, "Socks5", tags);
        }
    }
}

await addSocks5ProxyFromUrl("https://gitee.com/git-sync/proxy-list/raw/main/proxies_geolocation_anonymous/socks5.txt");

await Sleep(2000);
await SaveJsonConfig(proxies, "./generated/proxies.json");
