import {createReadStream, createWriteStream} from 'fs';
import {InvalidArgInput} from "./error.js";
import {PathService} from '../service/pathService.js';

/**
 * @param {PathService} pathService
 * @param {string} filePath
 * @param {string} newFilePath
 * @return {Promise<string>}
 */
export default async function cp(pathService, filePath, newFilePath) {
    if (!filePath) {
        throw new InvalidArgInput('filePath');
    }
    if (!newFilePath) {
        throw new InvalidArgInput('newFilePath');
    }

    const fullFilePath = pathService.makeAbsolutePath(filePath);
    const fullNewFilePath = pathService.makeAbsolutePath(newFilePath);

    await pathService.validateIsFile(fullFilePath);

    const readStream = createReadStream(fullFilePath);
    const writeStream = createWriteStream(fullNewFilePath, {flags: 'w'});

    return new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        writeStream.on('error', (e) => reject(e));
        readStream.on('error', (e) => reject(e));
        readStream.on('end', () => {
            writeStream.close();
            resolve();
        });
    });
}
