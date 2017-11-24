/**
 * Represents the result of a void operation.
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
     * Creates a new Result object with specified success value and error message.
     * @param success Whether or not this result represents a successful operation.
     * @param message The message associated with an unsuccessful operation.
     */
    public constructor(success: boolean, message: string = 'Operation completed successfully') {
        this.success = success;
        this.message = message;
    }
}

/**
 * Represents the result of an operation.
 */
export class TypedResult<T> extends Result {

    /**
     * The resulting data that represents the result of the operation.
     */
    public data: T | null;

    /**
     * Creates a new typd Result object with specified success value, error message, and result data.
     * @param success 
     * @param message 
     * @param data 
     */
    public constructor(success: boolean, data: T | null, message: string = '') {
        super(success, message);
        this.data = data;
    }
}