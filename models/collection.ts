import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
    {   _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        storeId: { type: String, required: true },
        products: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
            name: { type: String, required: true },
            images: {
                imageSrc: { type: String, required: true },
                imageAlt: { type: String, required: true }
            },
            price: { type: String, required: true },
            description: { type: String, required: true },
            category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
            status: { type: String, required: true },
            discount: { type: String, required: true },
            storeId: { type: String, required: true }, 
            colors: [
                {
                  code: { type: String, required: true },
                  quantity: { type: String, required: true } 
                }]
        }]
        
    },
    { timestamps: true }
);

export default mongoose.models.Collections || mongoose.model("Collections", CollectionSchema);
