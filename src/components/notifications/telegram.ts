'use server';

type TelegramPayload = {
  chatId: string | number;
  message: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disableNotification?: boolean;
};

/**
 * Send Telegram notification
 * Implementation using Telegram Bot API
 */
export async function sendTelegramNotification({ 
  chatId, 
  message, 
  parseMode = 'HTML',
  disableNotification = false
}: TelegramPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
    return { success: false, error: 'Telegram bot token not configured' };
  }

  // Skip sending in development mode if configured
  if (process.env.NODE_ENV === "development" && process.env.TELEGRAM_DEV_MODE_ONLY_LOG === "true") {
    console.log("🤖 TELEGRAM NOTIFICATION (DEV MODE - NOT ACTUALLY SENT)");
    console.log(`Chat ID: ${chatId}`);
    console.log(`Message: ${message}`);
    console.log(`Parse Mode: ${parseMode}`);
    return { success: true, dev: true };
  }
  
  try {
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: parseMode,
        disable_notification: disableNotification
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Error sending Telegram notification:', data.description);
      return { success: false, error: data.description };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return { success: false, error };
  }
}

/**
 * Send a notification to a Telegram channel
 * @param message The message to send
 * @param channelName The channel name with @ prefix (e.g. @my_channel)
 */
export async function sendChannelNotification(message: string, channelName: string) {
  return sendTelegramNotification({
    chatId: channelName,
    message,
    parseMode: 'HTML'
  });
}

/**
 * Check if a Telegram bot token is valid
 */
export async function validateBotToken(token: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    
    if (!data.ok) {
      return { valid: false, error: data.description };
    }
    
    return { 
      valid: true, 
      botInfo: {
        id: data.result.id,
        username: data.result.username,
        firstName: data.result.first_name,
        isBot: data.result.is_bot
      } 
    };
  } catch (error) {
    return { valid: false, error: 'Failed to validate bot token' };
  }
}
