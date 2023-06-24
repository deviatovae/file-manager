import readline from 'readline';
import os from 'os';

let curDir = os.homedir();

const greetMsg = `Welcome to the File Manager, {{username}}!\n`;
const thanksMsg = 'Thank you for using File Manager, {{username}}, goodbye!';

const pwd = () => {
    console.log(`You are currently in ${curDir}`);
}

const parseArgs = (args) => {
    return args
        .slice(2)
        .filter(arg => arg.startsWith('--'))
        .reduce((result, arg) => {
            const [argName, argValue] = arg.substring(2).split('=');
            return {...result, [argName]: argValue}
        },{})

};
const sendMsgToUser = (username, message) => {
    const name = username.charAt(0).toUpperCase() + username.slice(1);
    console.log(message.replace('{{username}}', name));
}

const args = parseArgs(process.argv);

if (!args.username) {
    console.error('Username argument is required');
    process.exit(1);
}

sendMsgToUser(args.username, greetMsg);
pwd();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('close', () =>  sendMsgToUser(args.username, thanksMsg));

process.stdout.write(`Enter your command: `)
rl.on('line', () => {
    pwd()
    process.stdout.write(`\nEnter your command: `)
})
