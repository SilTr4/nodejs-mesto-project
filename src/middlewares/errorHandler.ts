import { ErrorRequestHandler } from 'express';
import errorCodes from '../utils/constants';

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const { statusCode = errorCodes.defaultError, message } = err;

  res.status(statusCode).send({
    message:
    statusCode === errorCodes.defaultError
      ? 'На сервере произошла ошибка'
      : message,
  });
};

export default errorHandler;
