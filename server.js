npm install express nodemailer body-parser
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any service (Gmail, SendGrid, etc.)
  auth: {
    user: 'your-email@gmail.com', // Your email
    pass: 'your-email-password',  // Your email password or an app password
  },
});

// Send verification code via email
app.post('/send-verification-code', (req, res) => {
  const { email } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

  // Email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset Verification Code',
    text: `Your password reset verification code is: ${verificationCode}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send({ message: 'Verification code sent', verificationCode });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const resetEmail = document.getElementById('resetEmail').value;

    // Send a POST request to the server to send the verification code
    fetch('http://localhost:3000/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Verification code sent') {
            alert('Check your email for the verification code!');
            localStorage.setItem('verificationCode', data.verificationCode);
            localStorage.setItem('userEmail', resetEmail);
            document.getElementById('forgotPasswordModal').style.display = 'none';
            window.location.href = 'verify-code.html';  // Redirect to the verification page
        } else {
            alert('Error: Unable to send verification code.');
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
});
