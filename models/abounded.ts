import mongoose from "mongoose";

const AboundedSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      storeId: {
        type: String,
        required: true,
      },
      products: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        }
      }],
      totalAmount: {
        type: Number,
        required: true,
      },
      lastActivityDate: {
        type: Date,
        default: Date.now
      },
      recoveryStatus: {
        type: String,
        enum: ["pending", "recovered", "lost"],
        default: "pending"
      }
    },
    { timestamps: true }
  );
    export default mongoose.models.Abounded || mongoose.model("Abounded", AboundedSchema);