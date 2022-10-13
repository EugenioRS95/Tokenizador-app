
export class CustomError extends Error {
    private code: number;

    constructor (code: number, message: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }

        this.code = code;
    } 
    public getCode(): number{
        return this.code;
    }
}