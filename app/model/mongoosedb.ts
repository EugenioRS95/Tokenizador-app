import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
const dotenvPath = path.join(__dirname, '../', '../','../',`config/.env.${process.env.NODE_ENV}`);
dotenv.config({
    path: dotenvPath,
});


export default mongoose.connect(process.env.DB_URL || "", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});