import mongoose from "mongoose";

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
    maxlength: 30
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model<TCard>('card', cardSchema);