import {open} from 'fs/promises';
import {join} from 'path';
import {InvalidInput} from "./error.js";

export async function add(filename, workDir) {
    if (!filename) {
        throw new InvalidInput('filename argument is not defined');
    }
    if (!workDir) {
        throw new InvalidInput('workDir argument is not defined');
    }

    const file = await open(join(workDir, filename), 'a');
    await file.close();
}
