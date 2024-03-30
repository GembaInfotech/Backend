import Razorpay from "razorpay";

 const apiKey = "rzp_test_muLBb6gKqfrZA5"
 const apiSecret = "Pr8ALVkn1EA6H7iDMqJY8yVL"


const razorpay = new Razorpay({
    key_id: apiKey,
    key_secret: apiSecret,
  });


export default razorpay;