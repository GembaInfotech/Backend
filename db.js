
import mongoose from "mongoose";
const connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://prashantrana9516:2wu$.Qps6uFELnW@cluster0.q7thprq.mongodb.net/?retryWrites=true&w=majority', {
          
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process with a failure code
    }
};

export {connect}
