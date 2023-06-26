export class InvalidInput extends Error {
    constructor(message) {
        super('Invalid input: ' + message);
    }
}

export class OperationFailed extends Error {
    constructor(message) {
        super('Operation failed: ' + message);
    }
}
