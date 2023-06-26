import {createReadStream} from 'fs';
import {rename} from 'fs/promises';
import {InvalidArgInput, OperationFailed} from "./error.js";
import {PathService} from '../service/pathService.js';

/**
 * @param {PathService} pathService
 * @param {string} filePath
 * @param {string} newFilePath
 * @return {Promise<string>}
 */
export default async function rn(pathService, filePath, newFilePath) {
    if (!filePath) {
        throw new InvalidArgInput('filePath');
    }
    if (!newFilePath) {
        throw new InvalidArgInput('newFilePath');
    }

    const fullFilePath = pathService.makeAbsolutePath(filePath);
    const fullNewFilePath = pathService.makeAbsolutePath(newFilePath);

    await pathService.validateIsFile(fullFilePath)

    await rename(fullFilePath, fullNewFilePath)
}
