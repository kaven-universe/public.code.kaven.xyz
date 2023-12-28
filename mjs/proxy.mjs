/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /mjs/proxy.mjs
 * @create:      2023-12-28 15:37:23.256
 * @modify:      2023-12-28 16:21:06.789
 * @times:       5
 * @lines:       68
 * @copyright:   Copyright © 2023 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import { Sleep, SplitStringByNewline } from "kaven-basic";
import { HttpTryGetText, SaveJsonConfig } from "kaven-utils";
import { createConnection } from "node:net";

const proxies = [];

const url = "https://gitee.com/mirrors_TheSpeedX/PROXY-List/raw/master/socks5.txt"; // "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt"
const data = await HttpTryGetText(url);
const lines = SplitStringByNewline(data);
if (lines && lines.length > 0) {
    for (const line of lines) {
        const [host, port] = line.split(":");

        const socket = createConnection(port, host);

        // Event: Connection established
        socket.on('connect', () => {
            console.log(`TCP server at ${host}:${port} is available.`);
            socket.end(); // Close the connection after testing

            proxies.push({
                "Type": "Socks5",
                "Host": host,
                "Port": Number(port),
                "Tags": [
                    "Socks5",
                    "TheSpeedX"
                ],
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

    await Sleep(2000);
}

await SaveJsonConfig(proxies, "./generated/fixed-proxy.json");
