import {InvalidArgInput} from "./error.js";
import {PathService} from "../service/pathService.js";
import {readFile} from "fs/promises";
import crypto from "crypto";

/**
 * @param {PathService} pathService
 * @param {string} path
 * @return {Promise<string>}
 */
export default async function hash(pathService, path) {
    if (!path) {
        throw new InvalidArgInput('path');
    }

    const fullPath = pathService.makeAbsolutePath(path);

    await pathService.validateIsFile(fullPath);
    const content = await readFile(fullPath);
    return crypto.createHash('sha256')
        .update(content)
        .digest('hex');
}
