import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { Joi, celebrate, errors } from 'celebrate';
import { CustomError } from './errors/CustomError';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import loggers from './middlewares/logger'

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(loggers.requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/login', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(2).max(30),
  }),
}), login);

app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(loggers.errorLogger);

app.use(errors);
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;


  res.status(statusCode).send({ message:
    statusCode === 500
    ? 'На сервере произошла ошибка'
    : message
  });
});

app.listen(PORT);