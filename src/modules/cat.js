import {createReadStream} from 'fs';
import {InvalidArgInput} from "./error.js";
import {PathService} from "../service/pathService.js";

/**
 * @param {PathService} pathService
 * @param {string} path
 * @return {Promise<string>}
 */
export default async function cat(pathService, path) {
    if (!path) {
        throw new InvalidArgInput('path');
    }

    const fullPath = pathService.makeAbsolutePath(path);

    await pathService.validateIsFile(fullPath);

    const stream = createReadStream(fullPath);
    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
}
