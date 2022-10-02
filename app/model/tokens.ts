import mongoose from "mongoose";

export type tokensDocument = mongoose.Document & {
    id: string,
    token: string
};

const tokensSchema = new mongoose.Schema({
    id: String,
    token: String
});

export const tokens = (mongoose.models.tokens || 
    mongoose.model<tokensDocument>('tokens', tokensSchema, process.env.DB_TOKENS_COLLECTION)
    );