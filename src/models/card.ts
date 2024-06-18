import mongoose from 'mongoose';
import user from './user';

type TCard = {
  name: string,
  link: string,
  owner: mongoose.Schema.Types.ObjectId,
  likes: mongoose.Schema.Types.ObjectId[],
  createdAt: Date
}

export const cardSchema = new mongoose.Schema<TCard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^https?:\/\/(w{3}\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(v),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: user,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: user,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

export default mongoose.model<TCard>('card', cardSchema);
