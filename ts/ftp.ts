import * as FTPClient from "ftp";

export async function UploadFileToFtpServer(
    fileName: string,
    serverHost = "localhost",
    serverPort = 21,
    serverUserName?: string,
    serverUserPassword?: string,
    options?: {
        cwd?: string;
    },
) {
    return new Promise<string>((resolve, reject) => {
        const exist = IsPathExistSync(fileName);
        if (!exist) {
            reject(new Error(`File not exist: ${fileName}`));
            return;
        }

        const destName = GetFileName(fileName);

        // https://github.com/mscdex/node-ftp
        const ftpClient = new FTPClient();
        ftpClient
            .on("ready", () => {
                const put = () => {
                    ftpClient.put(fileName, destName, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(fileName);
                        }
                        ftpClient.end();
                    });
                };

                if (options?.cwd) {
                    ftpClient.cwd(options.cwd, err => {
                        if (err) {
                            reject(err);
                        } else {
                            put();
                        }
                    });
                } else {
                    put();
                }
            })
            .on("greeting", (welcome) => {
                KavenLogger.Default.Info(welcome);
            })
            .on("error", (err) => {
                reject(err);
            })
            .on("end", () => {
                KavenLogger.Default.Info("ftp end");
            });

        // server address can't include "ftp://" prefix
        serverHost = TrimStart(serverHost, "ftp://");
        serverHost = TrimStart(serverHost, "ftps://");

        const config: FTPClient.Options = {
            host: serverHost,
            password: serverUserPassword,
            port: serverPort,
            user: serverUserName,
            secure: true,
            secureOptions: {
                rejectUnauthorized: false,
            },
        };

        ftpClient.connect(config);
    });
}