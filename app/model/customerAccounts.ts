import mongoose from "mongoose";

export type customerAccountsDocument = mongoose.Document & {
    id: string,
    email: string,
    card_number: number,
    cvv: number,
    expiration_year: string,
    expiration_month: string,
    token: string
};

const customerAccountsSchema = new mongoose.Schema({
    id: String,
    email: String,
    card_number: Number,
    cvv: Number,
    expiration_year: String,
    expiration_month: String,
    token: String,
    createdAt: { type: Date, expires: '16m', default: Date.now }
});

export const customerAccounts = (mongoose.models.customerAccounts || 
    mongoose.model<customerAccountsDocument>('customerAccounts', customerAccountsSchema, process.env.DB_CUSTOMERACCOUNTS_COLLECTION)
    );