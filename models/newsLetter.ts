import mongoose from "mongoose";

const NewsLetterSchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.NewsLetter ||
  mongoose.model("NewsLetter", NewsLetterSchema);
