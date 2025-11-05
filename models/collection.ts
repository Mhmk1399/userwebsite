import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        storeId: { type: String, required: true },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
    },
    { timestamps: true }
);

export default mongoose.models.Collections || mongoose.model("Collections", CollectionSchema);
