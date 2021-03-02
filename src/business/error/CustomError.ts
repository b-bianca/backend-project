export class CustomError extends Error {
    constructor(
       public readonly statusCode: number = 400,
       message: string
    ) {
       super(message);
    }
}