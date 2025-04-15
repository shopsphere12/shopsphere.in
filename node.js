const express = require('express');
const twilio = require('twilio');
const app = express();
const port = 3000;

app.use(express.json());

// Twilio setup
const accountSid = 'your_twilio_account_sid';
const authToken = 'your_twilio_auth_token';
const client = twilio(accountSid, authToken);

// Temporary in-memory OTP storage (you can use a database)
let otpStorage = {};

app.post('/send-otp', (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit OTP

    // Store the OTP temporarily
    otpStorage[phone] = otp;

    // Send OTP via Twilio
    client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+1your_twilio_number',
        to: phone
    }).then(() => {
        res.send({ success: true });
    }).catch(err => {
        res.status(500).send({ success: false, error: err.message });
    });
});

app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    const phone = req.body.phone; // Make sure to pass the phone number when verifying

    if (otpStorage[phone] == otp) {
        res.send({ success: true });
    } else {
        res.send({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
