import { NextFunction, Request, Response } from "express";
import Users from '../models/user';
import { CustomError } from "../errors/CustomError";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const getAllUSers = (req: Request, res: Response, next: NextFunction) => {
  Users.find({})
    .then(users => {res.send(users)})
    .catch(err => next(err));
}

export const getUSer = (req: Request, res: Response, next: NextFunction) => {
  Users.findById(req.params.userId)
    .then(user => {
      if (!user) {
        throw new CustomError('Нет пользователя с таким id', 404);
      }
      res.send(user)})
    .catch(next);
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  if (!password) {
    res.send({ message: 'Введен некоректный логин или пароль'});
    return;
  }
  bcrypt.hash(password, 10)
    .then(hash => Users.create({ name, about, avatar, email, password: hash }))
    .then(user => res.send(user))
    .catch(err => next(err));
}

export const updateUserData = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const user = res.locals.user._id;
  Users.findByIdAndUpdate(user, { name, about }, { new: true, runValidators: true })
    .then(user => {
      if (!user) {
        throw new CustomError('Нет пользователя с таким id', 404);
      }
      res.send(user)})
    .catch(err => next(err));
}

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const user = res.locals.user._id;
  Users.findByIdAndUpdate(user, { avatar }, { new: true, runValidators: true, upsert: true })
    .then(user => {
      if (!user) {
        throw new CustomError('Нет пользователя с таким id', 404);
      }
      res.send(user)})
    .catch(err => next(err));
}

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  Users.findOne({ email }).select('+password')
    .then(data => {
      if (!data) {
        throw new CustomError('Ошибка почты или пароля', 401);
      }
      return bcrypt.compare(password, data.password)
        .then(matched => {
          if (!matched) {
            throw new CustomError('Ошибка почты или пароля', 401);
          }
          const token = jwt.sign({ _id: data._id }, 'super-key', { expiresIn: '7d' });
          res.cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ access: 'approved', token: token });
        })
    })
    .catch(err => next(err));
}