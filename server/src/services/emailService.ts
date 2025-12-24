import { config } from 'dotenv';
import path from 'path';
// Debug the .env file path
const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env from:', envPath);
// Load the environment variables
const envResult = config({ path: envPath });
if (envResult.error) {
  console.error('❌ Error loading .env file:', envResult.error);
} else {
  console.log('✅ .env file loaded successfully');
  console.log('Environment variables found:', Object.keys(envResult.parsed || {}));
}
// Now import other dependencies
import nodemailer from 'nodemailer';
// Debug log environment variables (remove in production)
console.log('SMTP Configuration:', {
  host: process.env.SMTP_HOST ? '***' : '❌ Not set',
  port: process.env.SMTP_PORT || '587 (default)',
  user: process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(-4) : '❌ Not set',
  from: process.env.EMAIL_FROM || '❌ Not set',
  pass: process.env.SMTP_PASS ? '***' : '❌ Not set',
  // Add debug for NODE_ENV
  node_env: process.env.NODE_ENV || '❌ Not set'
});

// Debug log environment variables (remove in production)
console.log('SMTP Configuration:', {
  host: process.env.SMTP_HOST ? '***' : ' Not set',
  port: process.env.SMTP_PORT || '587 (default)',
  user: process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(-4) : ' Not set',
  from: process.env.EMAIL_FROM || ' Not set',
  pass: process.env.SMTP_PASS ? '***' : ' Not set'
});

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only for development with self-signed certificates
  }
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error(' SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to take our messages');
  }
});

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:8080'}/verify-email?token=${token}`;
  
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* Your existing CSS styles here */
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6; 
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      /* ... rest of your CSS ... */
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>MODESTA</h1>
        <p>Luxury Modest Fashion</p>
      </div>
      <div class="content">
        <h2>Welcome to MODESTA!</h2>
        <p>Thank you for signing up. We're excited to have you join our community of modest fashion enthusiasts.</p>
        <p>To get started, please verify your email address by clicking the button below:</p>
        
        <div class="button-container">
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </div>
        
        <div class="link-box">
          <p>Or copy and paste this link into your browser:</p>
          <a href="${verificationUrl}" class="link">${verificationUrl}</a>
        </div>
        
        <div class="expiry-notice">
          <p><strong>⏰ This verification link will expire in 24 hours.</strong></p>
        </div>
        
        <p class="ignore-notice">
          If you didn't create an account with MODESTA, you can safely ignore this email.
        </p>
      </div>
      <div class="footer">
        <p><strong>MODESTA</strong> - Luxury Modest Fashion</p>
        <p>© ${new Date().getFullYear()} MODESTA. All rights reserved.</p>
        <p>Questions? Contact us at <a href="mailto:support@modesta.com">support@modesta.com</a></p>
      </div>
    </div>
  </body>
  </html>`;

  const text = `Welcome to MODESTA!

Thank you for signing up. We're excited to have you join our community of modest fashion enthusiasts.

Please verify your email address by clicking the link below:

${verificationUrl}

Or copy and paste this link into your browser:
${verificationUrl}

⏰ This link will expire in 24 hours.

If you didn't create an account with MODESTA, you can safely ignore this email.

---
MODESTA - Luxury Modest Fashion
© ${new Date().getFullYear()} MODESTA. All rights reserved.
Questions? Contact us at support@modesta.com`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to MODESTA - Verify Your Email',
    html,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Verification email sent:', info.messageId);
    console.log('✓ Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};