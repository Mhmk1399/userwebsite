import mongoose from "mongoose";
import product from "./product";

export const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreUsers",
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    items: [
      {
     
        // Product reference
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: product,
          required: true,
        },
        // Product details (cached for performance)
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: {
          type: String,
          required: true,
        },
        // Selected color code (hex or color name)
        colorCode: {
          type: String,
          default: "",
        },
        // Selected properties (e.g., size, material, etc.)
        properties: [
          {
            name: {
              type: String,
              required: true,
            },
            value: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
