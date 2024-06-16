import mongoose from 'mongoose';
import validator = require('validator');

type TUser = {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string
}

const userSchema = new mongoose.Schema<TUser>({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png"
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => { return validator.isEmail(v) }
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
});

export default mongoose.model<TUser>('user', userSchema);
