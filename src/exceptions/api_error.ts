export class ApiError extends Error {
    status;
    errors;

    constructor(status: number, message: string, errors?: Array<any>) {
        super (message);
        this.status = status;
        this.errors = errors
    }

    static UnauthoriezedError () {
        return new ApiError(401, "Unauthorized user")
    }

    static BadRequest (message: string, errors = []) {
        return new ApiError(400, message, errors )
    }

    static NotFoundError(message: string) {
        return new ApiError(404, message)
    }

    static ExecutingError (message: string) {
        return new ApiError(500, message)
    }

}