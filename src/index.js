import readline from 'readline';
import os from 'os';
import {WorkDir} from "./modules/workDir/index.js";
import cat from "./modules/cat.js";
import {InvalidInput} from "./modules/error.js";

const workDir = new WorkDir(os.homedir());

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('close', () => sendMsgToUser(args.username, thanksMsg));

process.stdout.write(`Enter your command: `);
rl.on('line', async (line) => {
    try {
        const [command, ...args] = line.split(' ');
        switch (command) {
            case 'up':
                workDir.up();
                break;
            case 'cat':
                console.log(await cat(args[0], workDir.getWorkDir()));
                break;
            default:
                throw new InvalidInput('command is not found');
        }
    } catch (e) {
        console.error(`\n${e.message}`);
    }

    workDir.pwd();
    process.stdout.write(`\nEnter your command: `);
});
