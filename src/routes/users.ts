import { Router } from "express";
import { Joi, celebrate } from "celebrate";
import { getAllUSers, getUSer, createUser, updateUserAvatar, updateUserData } from "../controllers/users";
import { abort } from "process";
import user from "models/user";

const router = Router();

router.get('/users', getAllUSers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum(),
  }),
}), getUSer);
router.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
    avatar: Joi.string().required(),
  }),
}), createUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
    user: Joi.object().keys({
      _id: Joi.string().required(),
    }),
  }),
}), updateUserData);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
    user: Joi.object().keys({
      _id: Joi.string().required(),
    }),
  }),
}), updateUserAvatar);

export default router;