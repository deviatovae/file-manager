import {join, resolve} from "path";

export default class WorkDir {
    constructor(startPath) {
        this.workDir = startPath;
    }

    getWorkDir() {
        return this.workDir;
    }

    up() {
        this.workDir = resolve(join(this.getWorkDir(), '..'))
    }

    pwd() {
        console.log(`You are currently in ${this.getWorkDir()}`);
    }
}
