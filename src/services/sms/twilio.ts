import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

interface TwilioFunctions {
  sendSMS: (to: string, message: string) => Promise<unknown>;
  sendWhatsApp: (to: string, message: string) => Promise<unknown>;
}

// **Send SMS via Twilio**
export const TwilioService: TwilioFunctions = {
  sendSMS: async (to: string, message: string) => {
    try {
      const response = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER, // Twilio registered number
        to,
      });
      return { success: true, sid: response.sid };
    } catch (error) {
      console.error('Twilio Error:', error);
      return { success: false, error };
    }
  },

  sendWhatsApp: async (to: string, message: string) => {
    try {
      const response = await client.messages.create({
        body: message,
        from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER, // Twilio WhatsApp number
        to: 'whatsapp:' + to, // Recipient's WhatsApp number
      });
      return { success: true, sid: response.sid };
    } catch (error) {
      console.error('Twilio WhatsApp Error:', error);
      return { success: false, error };
    }
  },
};
