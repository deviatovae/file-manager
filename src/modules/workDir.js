import {join, resolve} from "path";
import {getStats, makeAbsolutePath} from "../utils/utils.js";
import {InvalidArgInput, InvalidInput} from "./error.js";
import os from "os";

export default class WorkDir {
    constructor(startPath) {
        this.workDir = startPath;
    }

    getWorkDir() {
        return this.workDir;
    }

    up() {
        this.workDir = resolve(join(this.getWorkDir(), '..'));
    }

    async cd(path) {
        if (!path) {
            throw new InvalidArgInput('path')
        }
        if (path.startsWith('~')) {
            path = join(os.homedir(), path.slice(1))
        }

        const fullPath = makeAbsolutePath(path, this.workDir);
        const isDir = (await getStats(fullPath)).isDirectory();
        if (!isDir) {
            throw InvalidInput('path is not a directory');
        }

        this.workDir = fullPath;
    }

    pwd() {
        console.log(`You are currently in ${this.getWorkDir()}`);
    }
}
