import {isAbsolute, join} from "path";
import {OperationFailed} from "../modules/error.js";
import {stat} from 'fs/promises';
import {getStats, makeAbsolutePath} from "../utils/utils.js";

export default class PathService {
    /**
     * @param {WorkDir} workDir
     */
    constructor(workDir) {
        this.workDir = workDir;
    }

    makeAbsolutePath(path) {
        return makeAbsolutePath(path, this.workDir.getWorkDir())
    }

    async isFile(fullPath) {
        return (await getStats(fullPath)).isFile();
    }

    async validateIsFile(filepath) {
        if (!await this.isFile(filepath)) {
            throw new OperationFailed(`${filepath} is not a file`);
        }
    }
}
