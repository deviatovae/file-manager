export class DomainError extends Error {
    constructor(message) {
        super(message);
    }

    print() {
        console.log('\n' + this.message);
    }
}

export class InvalidInput extends DomainError {
    constructor(message) {
        super('Invalid input: ' + message);
    }
}

export class InvalidArgInput extends InvalidInput {
    constructor(argName) {
        super(`${argName} is not defined`);
    }
}

export class OperationFailed extends DomainError {
    constructor(message) {
        super('Operation failed: ' + message);
    }

    static fromError(e) {
        return new OperationFailed(e.message)
    }
}
