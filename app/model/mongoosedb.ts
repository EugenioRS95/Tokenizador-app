import mongoose from 'mongoose';

export default mongoose.connect(process.env.DB_URL || "", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});