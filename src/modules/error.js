export class DomainError extends Error {
    constructor(message) {
        super(message);
    }

    print() {
        console.error('\n' + this.message);
    }
}

export class InvalidInput extends DomainError {
    constructor(message) {
        super('Invalid input: ' + message);
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
