// routes/token.js

const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();
const cors = require('cors');

const emailRouter = express.Router();
emailRouter.use(cors());
emailRouter.use(express.json());

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Sample route: Send OTP via email
emailRouter.post('/send-otp', async (req, res) => {
  try {
    const { email, subject, content } = req.body;
    if (!email || !subject || !content) throw new Error('Please provide email, subject, and content!');

    const myAccessTokenObject = await oAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USERNAME, // Update this to use process.env
        clientId: process.env.CLIENT_ID, // Update this to use process.env
        clientSecret: process.env.CLIENT_SECRET, // Update this to use process.env
        refresh_token: process.env.REFRESH_TOKEN, // Update this to use process.env
        accessToken: myAccessToken,
      },
    });

    const mailOptions = {
      to: email,
      subject: subject,
      html: `<h3>${content}</h3>`,
    };

    await transport.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
});

// Add more routes as needed

module.exports = emailRouter;
