export class CustomError extends Error {
  statusCode: number;
  constructor(message: string | undefined, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}