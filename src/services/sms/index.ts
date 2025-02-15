const config = {
  SMS_PROVIDER: 'twilio' // Use ':' instead of '='
};

interface TwilioFunctions {
sendSMS: (to: string, message: string) => Promise<unknown>;
sendWhatsApp: (to: string, message: string) => Promise<unknown>;
}

// **Dynamically Import & Return Twilio Functions**
export async function getTwilioFunctions(): Promise<TwilioFunctions | false> {
const smsProvider = config.SMS_PROVIDER;

if (smsProvider === 'twilio') {
  const { TwilioService } = await import('./twilio'); // Import TwilioService correctly
  return TwilioService;
}

return false;
}
