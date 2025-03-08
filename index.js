const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const RazorPay = require('razorpay');
const crypto = require("crypto");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.status(200).send('App is Running...');
});

app.post('/api/payment/orders', (req, res) => {
    console.log('Received request body:', req.body);  // Log incoming request for debugging

    try {
        const razorpayInstance = new RazorPay({
            key_id: 'rzp_test_mCMlVmSddD7DaT',
            key_secret: 'Wty3hx96on4xezaGhqGzp7FJ'
        });

        const options = {
            amount: req.body.amount * 100,  // Make sure the amount is in paise (multiplying by 100)
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex')
        };

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.error('Razorpay error:', error);  // Log the error for debugging
                return res.status(500).json({ message: 'Order creation failed', error });
            }

            res.status(200).json({ data: order });
        });

    } catch (error) {
        console.error('Internal server error:', error);  // Log the internal error
        res.status(500).send("Internal Server Error");
    }
});

app.post('/api/payment/verify', (req, res) => {
try{
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;

    const sign = razorpay_order_id + '|' +razorpay_payment_id
    const expSignature = crypto.createHmac("sha256",'Wty3hx96on4xezaGhqGzp7FJ')
    .update(sign.toString())
    .digest("hex")

    if(expSignature === razorpay_signature){
        return res.status(200).send("Sucess..")
    }
    else{
        res.status(400).send("Failure...")
    }
}catch(error){
    console.log(error)
}
}) 

app.listen(8080, function () {
    console.log("Server started on port 8080");
});
