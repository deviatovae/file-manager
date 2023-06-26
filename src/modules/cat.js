import {createReadStream} from 'fs';
import {stat} from 'fs/promises';
import {InvalidInput, OperationFailed} from "./error.js";
import {isAbsolute, join} from 'path';

export default async function cat(path, workDir) {
    if (!path) {
        throw new InvalidInput('path argument is not defined');
    }

    const fullPath = isAbsolute(path) || !workDir ? path : join(workDir, path);

    await stat(fullPath)
        .catch((e) => {
            throw new OperationFailed(e.message);
        })
        .then((info) => {
            if (!info.isFile()) {
                throw new OperationFailed('is not a file');
            }
        });

    const stream = createReadStream(fullPath);
    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
}
