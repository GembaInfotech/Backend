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
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET
    });

    // setting up options for razorpay order.
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "213ds32",
        payment_capture: 1
    };
    try {
        const response = await razorpay.orders.create(options)
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (err) {
       res.status(400).send('Not able to create order. Please try again!');
    }
  
}

const validate = async(req, res)=>{
    // const {razorpay_order_id, razorpay_payment_id, razorpay_signature} =req.body;
    // console.log(req.body);
    // const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    // sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    // const digest = sha.digest("hex");
    // if(digest!==razorpay_signature){
    //     return res.status(400).json({msg: "Transaction inj not legit!"});
    // }
    // res.json({
    //     msg:"success",
    //     orderId:razorpay_order_id,
    //     paymentId:razorpay_payment_id

    // })
    const data = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)

   data.update(JSON.stringify(req.body))

   const digest = data.digest('hex')

if (digest === req.headers['x-razorpay-signature']) {

       console.log('request is legit')

       //We can send the response and store information in a database.

       res.json({

           status: 'ok'

       })

} else {

       res.status(400).send('Invalid signature');

   }
}

export { sayHello, order, validate };