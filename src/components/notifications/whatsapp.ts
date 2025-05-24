'use server';

type WhatsAppPayload = {
  to: string;
  message: string;
};

/**
 * Send WhatsApp notification
 * Implementation will depend on your WhatsApp provider
 */
export async function sendWhatsAppNotification({ to, message }: WhatsAppPayload) {
  // Skip sending in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("📱 WHATSAPP NOTIFICATION (DEV MODE - NOT ACTUALLY SENT)");
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    return { success: true };
  }
  
  try {
    // Replace with your actual WhatsApp API implementation
    // Example with Twilio:
    // const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilioClient.messages.create({
    //   body: message,
    //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    //   to: `whatsapp:${to}`
    // });
    
    // For now, we'll just log the attempt
    console.log(`WhatsApp notification would be sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return { success: false, error };
  }
} 