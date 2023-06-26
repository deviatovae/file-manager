import {PathService} from "../service/pathService.js";
import {createReadStream, createWriteStream} from "fs";
import {InvalidArgInput, InvalidInput} from "./error.js";
import {createBrotliCompress, createBrotliDecompress} from 'zlib';

export default class Compressor {
    /**
     * @param {PathService} pathService
     */
    constructor(pathService) {
        this.pathService = pathService;
    }

    process(path, destPath, brotliStream) {
        if (!path) {
            throw new InvalidArgInput('path');
        }

        if (!destPath) {
            throw new InvalidArgInput('destPath');
        }

        const fullPath = this.pathService.makeAbsolutePath(path);
        const fullDestPath = this.pathService.makeAbsolutePath(destPath);

        const readStream = createReadStream(fullPath);
        const writeStream = createWriteStream(fullDestPath);

        readStream.pipe(brotliStream).pipe(writeStream);

        return new Promise((resolve, reject) => {
            readStream.on('error', (e) => reject(e))
            writeStream.on('error', (e) => reject(e))
            writeStream.on('finish', () => {
                writeStream.close()
                resolve()
            })
        })
    }

    compressFile(path, destPath) {
        if(destPath && !destPath.endsWith('.br')) {
            throw new InvalidInput('Destination path should end with .br');
        }
        return this.process(path, destPath, createBrotliCompress());
    }

    decompressFile(path, destPath) {
        if(path && !path.endsWith('.br')) {
            throw new InvalidInput('Source path should end with .br');
        }
        return this.process(path, destPath, createBrotliDecompress());
    }
}
