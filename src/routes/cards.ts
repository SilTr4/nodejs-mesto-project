import { Router } from "express";
import { getAllCards, createCard, deleteCard, likeCard, dislikeCard } from "../controllers/cards";
import { celebrate, Joi } from "celebrate";

const router = Router();

router.get('/cards', getAllCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    user: Joi.object().keys({
      _id: Joi.string().required(),
    }),
  }),
}), createCard);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum(),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().required(),
    }),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum(),
  }),
}), likeCard);
router.delete('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().required(),
    }),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum(),
  }),
}), dislikeCard);

export default router;