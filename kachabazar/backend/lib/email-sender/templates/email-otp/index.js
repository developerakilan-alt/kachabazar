/**
 * Email template for OTP verification
 */

const emailOtpBody = (option) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; color: #374151; margin-bottom: 20px; }
    .message { font-size: 16px; color: #6b7280; line-height: 1.6; margin-bottom: 30px; }
    .otp-container { text-align: center; margin: 30px 0; }
    .otp-code { display: inline-block; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #10b981; border-radius: 12px; padding: 20px 40px; font-size: 36px; font-weight: bold; color: #059669; letter-spacing: 8px; font-family: 'Courier New', monospace; }
    .expiry { text-align: center; font-size: 14px; color: #9ca3af; margin-top: 15px; }
    .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .warning p { margin: 0; color: #92400e; font-size: 14px; }
    .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { margin: 5px 0; color: #9ca3af; font-size: 14px; }
    .brand { font-weight: 600; color: #10b981; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Email Verification</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Hello ${option.name},</p>
      
      <p class="message">
        Thank you for registering with <span class="brand">KachaBazar</span>! 
        Please use the verification code below to complete your registration.
      </p>
      
      <div class="otp-container">
        <div class="otp-code">${option.code}</div>
        <p class="expiry">This code expires in <strong>10 minutes</strong></p>
      </div>
      
      <div class="warning">
        <p>⚠️ <strong>Security Notice:</strong> Never share this code with anyone. 
        Our team will never ask for your verification code.</p>
      </div>
      
      <p class="message">
        If you didn't request this verification code, please ignore this email 
        or contact our support team if you have concerns.
      </p>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing <span class="brand">KachaBazar</span></p>
      <p>© ${new Date().getFullYear()} KachaBazar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

module.exports = { emailOtpBody };
