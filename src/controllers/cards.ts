import { NextFunction, Request, Response } from "express";
import Cards from '../models/card';
import { CustomError } from "../errors/CustomError";

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Cards.find({})
    .then(cards => {res.send(cards)})
    .catch(err => next(err));
}

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const user = res.locals.user._id;
  Cards.create({ name, link, owner: user })
    .then(card => res.send(card))
    .catch(err => next(err));
}

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Cards.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new CustomError('Карточка с указанным _id не найдена.', 404)
      }
      if (card.owner !== res.locals.user._id) {
        res.send({ response: 'Вы не можете удалять чужие карточки'})
        return;
      }
      res.send({ status: "success" })
    })
    .catch(err => next(err));
}

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: res.locals.user._id }}, { new: true })
    .then((card) => {
      if (!card) {
        throw new CustomError('Карточка с указанным _id не найдена.', 404)
      }
      res.send(card)
    })
    .catch(err => next(err));
}

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: res.locals.user._id  }}, { new: true })
    .then((card) => {
      if (!card) {
        throw new CustomError('Карточка с указанным _id не найдена.', 404)
      }
      res.send(card)
    })
    .catch(err => next(err));
}