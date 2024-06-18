import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  getAllUSers, getUSer, updateUserAvatar, updateUserData,
} from '../controllers/users';

const router = Router();

router.get('/users', getAllUSers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum(),
  }),
}), getUSer);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUserData);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

export default router;
