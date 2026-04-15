import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) Create a transporter
  // In development, you can use Mailtrap or similar
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER || 'dummy',
      pass: process.env.EMAIL_PASS || 'dummy',
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `FocusVault Support <${process.env.EMAIL_FROM || 'support@focusvault.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: 
  };

  // 3) Actually send the email
  try {
    await transporter.sendEmail(mailOptions);
    console.log(`📡 Neural Email Dispatched to: ${options.email}`);
  } catch (err) {
    // If SMTP fails in dev, we just log the link to console so the user can continue
    console.warn('⚠️ SMTP Dispatch failed. Simulation active. Neural reset link:');
    console.log(options.message);
  }
};

export default sendEmail;
