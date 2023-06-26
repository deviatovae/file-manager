// noinspection ExceptionCaughtLocallyJS

import readline from 'readline';
import WorkDir from "./modules/workDir.js";
import cat from "./modules/cat.js";
import {DomainError, InvalidInput, OperationFailed} from "./modules/error.js";
import add from "./modules/add.js";
import PathService from "./service/pathService.js";
import rn from "./modules/rn.js";
import cp from "./modules/cp.js";
import mv from "./modules/mv.js";
import rm from "./modules/rm.js";
import Os from "./modules/os.js";
import hash from "./modules/hash.js";
import Compressor from "./modules/compressor.js";

const os = new Os();
const workDir = new WorkDir(os.homedir());
const pathService = new PathService(workDir);
const compressor = new Compressor(pathService);

const greetMsg = `Welcome to the File Manager, {{username}}!\n`;
const thanksMsg = 'Thank you for using File Manager, {{username}}, goodbye!';

const parseArgs = (args) => {
    return args
        .slice(2)
        .filter(arg => arg.startsWith('--'))
        .reduce((result, arg) => {
            const [argName, argValue] = arg.substring(2).split('=');
            return {...result, [argName]: argValue};
        }, {});

};
const sendMsgToUser = (username, message) => {
    const name = username.charAt(0).toUpperCase() + username.slice(1);
    console.log(message.replace('{{username}}', name));
};

const args = parseArgs(process.argv);

if (!args.username) {
    console.error('Username argument is required');
    process.exit(1);
}

sendMsgToUser(args.username, greetMsg);
workDir.pwd();
process.stdout.write(`\nEnter your command: `);

const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});

rl.on('close', () => sendMsgToUser(args.username, thanksMsg));

rl.on('line', async (line) => {
    try {
        const [command, ...args] = line.split(' ');
        let result;

        switch (command) {
            case 'up':
                workDir.up();
                break;
            case 'cd': {
                const path = args[0];
                result = workDir.cd(path);
                break;
            }
            case 'ls': {
                result = workDir.ls();
                break;
            }
            case 'cat': {
                const path = args[0];
                result = cat(pathService, path);
                break;
            }
            case 'add': {
                const filename = args[0];
                result = add(pathService, filename).then(() => `file ${filename} has been created`);
                break;
            }
            case 'rn': {
                const oldFilename = args[0];
                const newFilename = args[1];
                result = rn(pathService, oldFilename, newFilename)
                    .then(() => `file ${oldFilename} has been renamed to ${newFilename}`);
                break;
            }
            case 'cp': {
                const filename = args[0];
                const newFilename = args[1];
                result = cp(pathService, filename, newFilename)
                    .then(() => `file ${filename} has been copied to ${newFilename}`);
                break;
            }
            case 'mv': {
                const filename = args[0];
                const newFilename = args[1];
                result = mv(pathService, filename, newFilename)
                    .then(() => `file ${filename} has been moved to ${newFilename}`);
                break;
            }
            case 'rm': {
                const filename = args[0];
                result = rm(pathService, filename).then(() => `file ${filename} has been removed`);
                break;
            }
            case 'os': {
                result = os.handleCommand(args[0]);
                break;
            }
            case 'compress': {
                const filepath = args[0];
                const destPath = args[1];
                result = compressor.compressFile(filepath, destPath)
                    .then(() => `file ${filepath} has been compressed into ${destPath}`);
                break;
            }
            case 'decompress': {
                const filepath = args[0];
                const destPath = args[1];
                result = compressor.decompressFile(filepath, destPath)
                    .then(() => `file ${destPath} has been decompressed from ${filepath}`);
                break;
            }
            case 'hash': {
                const filepath = args[0];
                result = hash(pathService, filepath);
                break;
            }
            default:
                throw new InvalidInput('command is not found');
        }
        if (result) {
            await result.then((res) => {
                if (res) {
                    console.log(res)
                }
            });
        }
    } catch (e) {
        if (e instanceof DomainError) {
            e.print();
        } else {
            OperationFailed.fromError(e).print();
        }
    }

    workDir.pwd();
    process.stdout.write(`\nEnter your command: `);
});
