import { NextFunction, Request, Response } from "express";
import Users from '../models/user';
import { CustomError } from "../errors/CustomError";

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
      .catch(err => next(err));
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => next(err));
}

export const updateUserData = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, user } = req.body;
  Users.findByIdAndUpdate(user, { name, about }, { new: true, runValidators: true })
    .then(user => {
      if (!user) {
        throw new CustomError('Нет пользователя с таким id', 404);
      }
      res.send(user)})
    .catch(err => next(err));
}

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar, user } = req.body;
  Users.findByIdAndUpdate(user, { avatar }, { new: true, runValidators: true, upsert: true })
    .then(user => {
      if (!user) {
        throw new CustomError('Нет пользователя с таким id', 404);
      }
      res.send(user)})
    .catch(err => next(err));
}