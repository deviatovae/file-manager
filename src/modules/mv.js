import {rm} from 'fs/promises';
import {PathService} from '../service/pathService.js';
import cp from "./cp.js";

/**
 * @param {PathService} pathService
 * @param {string} filePath
 * @param {string} newFilePath
 * @return {Promise<string>}
 */
export default async function mv(pathService, filePath, newFilePath) {
    const fullFilepath = pathService.makeAbsolutePath(filePath);
    
    await cp(pathService, filePath, newFilePath).then(() => rm(fullFilepath));
}
