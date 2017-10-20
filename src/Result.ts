/**
 * Represents the result of an operation.
 */
export class Result {

    /**
     * The actual result of an operation. True if the operation succeeded, otherwise false.
     */
    public success: boolean;

    /**
     * If the operation failed, the error message associated with the failed operation.
     */
    public message: string;

    /**
     * Creates a new Result object.
     * @param success Whether or not this result represents a successful operation.
     * @param message The message associated with an unsuccessful operation.
     */
    public constructor(success: boolean, message: string = '') {
        this.success = success;
        this.message = message;
    }
}