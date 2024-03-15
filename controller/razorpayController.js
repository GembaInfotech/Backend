import Razorpay from "razorpay";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const sayHello = async (req, res) => {
  try {
    res.json({ data: "fgvhbjn" });
  } catch (err) {
    res.json(err);
  }
};


const order  = async (req, res) => {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
            return res.status(500).send("Razorpay credentials not provided");
        }
        console.log("fgh");

        const options = req.body;
        console.log(options);
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return res.status(500).send("Error creating order");
        }

        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }
}

const validate = async(req, res)=>{
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} =req.body;
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = sha.digest("hex");
    if(digest!==razorpay_signature){
        return res.status(400).json({msg: "Transaction inj not legit!"});
    }
    res.json({
        msg:"success",
        orderId:razorpay_order_id,
        paymentId:razorpay_payment_id

    })
}

export { sayHello, order, validate };