import {rm as fsRm} from 'fs/promises';
import PathService from '../service/pathService.js';

/**
 * @param {PathService} pathService
 * @param {string} filePath
 * @return {Promise<void>}
 */
export default async function rm(pathService, filePath) {
    const fullFilepath = pathService.makeAbsolutePath(filePath);

    await fsRm(fullFilepath);
}
