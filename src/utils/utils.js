import {isAbsolute, join} from "path";
import {stat} from "fs/promises";
import {OperationFailed} from "../modules/error.js";

export function makeAbsolutePath(path, workDir) {
    return isAbsolute(path) || !workDir ? path : join(workDir, path);
}

export async function getStats(fullPath) {
    return stat(fullPath)
        .catch((e) => {
            throw new OperationFailed(e.message);
        });
}

export function getConsoleOutput(callback) {
    const log = console.log;
    let info = '';
    console.log = function () {
        info += Array.from(arguments).join(' ') + '\n';
    };
    callback();
    console.log = log;

    return info
}
