
import mongoose from "mongoose";
const connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://prashantrana9516:zZcblPy7R01Ip5Gy@parking-1.doc0tf8.mongodb.net/?retryWrites=true&w=majority&appName=Parking-1', {
          
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process with a failure code
    }
};
export {connect}
