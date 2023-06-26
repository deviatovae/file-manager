import {open} from 'fs/promises';
import {InvalidArgInput} from "./error.js";
import {PathService} from "../service/pathService.js";

/**
 *
 * @param {PathService} pathService
 * @param {string} filename
 * @return {Promise<void>}
 */
export async function add(pathService, filename) {
    if (!filename) {
        throw new InvalidArgInput('filename');
    }

    const filepath = pathService.makeAbsolutePath(filename);
    const file = await open(filepath, 'a');
    await file.close();
}
