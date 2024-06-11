import { NextFunction, Request, Response } from "express";
import Cards from '../models/card';
import { CustomError } from "../errors/CustomError";

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Cards.find({})
    .then(cards => {res.send(cards)})
    .catch(err => next(err));
}

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link, user } = req.body;
  Cards.create({ name, link, owner: user })
    .then(card => res.send(card))
    .catch(err => next(err));
}

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Cards.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new CustomError('Карточка с указанным _id не найдена.')
      }
      res.send({ status: "success" })
    })
    .catch(err => next(err));
}

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.body.user }}, { new: true })
    .then((card) => {
      if (!card) {
        throw new CustomError('Карточка с указанным _id не найдена.')
      }
      res.send(card)
    })
    .catch(err => next(err));
}

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.body.user._id }}, { new: true })
    .then((card) => {
      if (!card) {
        throw new CustomError('Карточка с указанным _id не найдена.')
      }
      res.send(card)
    })
    .catch(err => next(err));
}