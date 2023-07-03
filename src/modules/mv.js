import PathService from '../service/pathService.js';
import cp from "./cp.js";
import rm from "./rm.js";

/**
 * @param {PathService} pathService
 * @param {string} filePath
 * @param {string} newFilePath
 * @return {Promise<string>}
 */
export default async function mv(pathService, filePath, newFilePath) {
    await cp(pathService, filePath, newFilePath).then(() => rm(pathService, filePath));
}
