import os from 'os';
import {InvalidInput} from "./error.js";
import {getConsoleOutput} from "../utils/utils.js";

export default class Os {
    eol() {
        return JSON.stringify(os.EOL);
    }

    cpus() {
        return os.cpus().map(({speed, model}) => ({
            Model: model,
            'Clock rate': speed < 100 ? 'Unspecified' : (speed / 1000).toFixed(2)
        }));
    }

    homedir() {
        return os.homedir();
    }

    username() {
        return os.userInfo().username;
    }

    architecture() {
        return os.arch();
    }

    /**
     * @param {string} argument
     */
    async handleCommand(argument) {
        if (!argument || !argument.startsWith('--')) {
            throw new InvalidInput('argument should start with --');
        }

        switch (argument.slice(2)) {
            case 'EOL':
                return this.eol();

            case 'cpus':
                const cpus = this.cpus();
                const info = getConsoleOutput(() => console.table(cpus));

                return `cpus count: ${cpus.length}\n${info}`;

            case 'homedir':
                return this.homedir();

            case 'username':
                return this.username();

            case 'architecture':
                return this.architecture();

            default:
                throw new InvalidInput('command is not found');
        }
    }
}
