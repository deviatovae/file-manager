import {join, resolve} from "path";
import {getConsoleOutput, getStats, makeAbsolutePath} from "../utils/utils.js";
import {InvalidArgInput, InvalidInput} from "./error.js";
import os from "os";
import {readdir} from 'fs/promises';

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
            throw new InvalidArgInput('path');
        }
        if (path.startsWith('~')) {
            path = join(os.homedir(), path.slice(1));
        }

        const fullPath = makeAbsolutePath(path, this.workDir);
        const isDir = (await getStats(fullPath)).isDirectory();
        if (!isDir) {
            throw InvalidInput('path is not a directory');
        }

        this.workDir = fullPath;
    }

    async ls() {
        const items = await readdir(this.workDir);
        const promises = items.map(async (item) => {
            const isDir = (await getStats(makeAbsolutePath(item, this.workDir))).isDirectory();
            return {
                Name: item,
                Type: isDir ? 'Directory' : 'File'
            };
        });
        const objects = (await Promise.all(promises))
            .sort((a, b) => {
                if (a.Type === 'Directory') {
                    return b.Type === 'Directory' ? a.Name.localeCompare(b.Name) : -1;
                }
                return b.Type === 'Directory' ? 1 : a.Name.localeCompare(b.Name);
            });

        return getConsoleOutput(() => {
            console.table(objects);
        });
    }

    pwd() {
        console.log(`You are currently in ${this.getWorkDir()}`);
    }
}
