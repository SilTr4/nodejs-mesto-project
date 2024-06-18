import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Users from '../models/user';
import CustomError from '../errors/CustomError';
import errorsCodes from '../utils/constants';

export const getAllUSers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await Users.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

export const getUSer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = await Users.findById(req.params.userId).orFail();
    return res.send(userData);
  } catch (err) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(
        new CustomError(
          'Нет пользователя с таким id',
          errorsCodes.notFoundError,
        ),
      );
    }
    return next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hashPass = await bcrypt.hash(password, 10);
    const user = await Users.create({
      name,
      about,
      avatar,
      email,
      password: hashPass,
    });
    return res.send(user);
  } catch (err: any) {
    if (err.code === 11000) {
      return next(
        new CustomError(
          'Адрес электронной почты уже зарегестрирован',
          errorsCodes.authError,
        ),
      );
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new CustomError('Введите коректные данные', errorsCodes.reqError),
      );
    }
    return next(err);
  }
};

export const updateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, about } = req.body;
    const user = res.locals.user._id;
    const userData = await Users.findByIdAndUpdate(
      user,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.send(userData);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new CustomError('Введите коректные данные', errorsCodes.reqError),
      );
    }
    return next(err);
  }
};

export const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;
    const user = res.locals.user._id;
    const userData = await Users.findByIdAndUpdate(
      user,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.send(userData);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new CustomError('Введите коректные данные', errorsCodes.reqError),
      );
    }
    return next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const userData = await Users.findOne({ email }).select('+password');
    if (!userData) {
      throw new CustomError('Ошибка почты или пароля', errorsCodes.authError);
    }
    const matched = await bcrypt.compare(password, userData!.password);
    if (!matched) {
      throw new CustomError('Ошибка почты или пароля', errorsCodes.authError);
    }
    const token = jwt.sign({ _id: userData._id }, 'super-key', {
      expiresIn: '7d',
    });
    return res
      .cookie('authorization', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .send({ access: 'approved' });
  } catch (err) {
    return next(err);
  }
};
