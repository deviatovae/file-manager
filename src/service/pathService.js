import {isAbsolute, join} from "path";
import {OperationFailed} from "../modules/error.js";
import {stat} from 'fs/promises';

export class PathService {
    /**
     * @param {WorkDir} workDir
     */
    constructor(workDir) {
        this.workDir = workDir;
    }

    makeAbsolutePath(path) {
        return isAbsolute(path) ? path : join(this.workDir.getWorkDir(), path);
    }

    async isFile(fullPath) {
        const info = stat(fullPath)
            .catch((e) => {
                throw new OperationFailed(e.message);
            });

        return (await info).isFile();
    }

    async validateIsFile(filepath) {
        if (!await this.isFile(filepath)) {
            throw new OperationFailed(`${filepath} is not a file`);
        }
    }
}
