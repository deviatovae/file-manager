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
