import { Resend } from 'resend';
const mjml = require('mjml');
import fs from 'fs';
import path from 'path';

// Initialize Resend with your API key
const resendClient = new Resend(process.env.RESEND_API_KEY );

export const sendEmail = async (to: string, subject: string, otp: string): Promise<void> => {
  try {
    // Read and process MJML template
    const templatePath = path.join(__dirname, '../templates/email-template.mjml');
    let mjmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders (e.g., {{otp}})
    //const otp = '456789'; // Example OTP
    mjmlTemplate = mjmlTemplate.replace('{{otp}}', otp);

    // Convert MJML to HTML
    const htmlOutput = mjml(mjmlTemplate).html;

    // Send email
    const response = await resendClient.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html: htmlOutput,
    });

    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
