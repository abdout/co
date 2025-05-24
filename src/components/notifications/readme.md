# Notification System Design

This document describes the architecture and usage of the notification system for the application, designed for scalability and extensibility.

## Goals
- **Internal notifications:** Show in-app notifications (e.g. for onboarding review events) and update the sidebar notification icon.
- **External notifications:** Support sending notifications via channels with **Telegram channel** .
- **Event-driven:** Use an event-based approach so new notification types and channels can be added easily.
- **Centralized logic:** All notification-related code lives in `src/notifications`.

---

## Folder Structure

```
src/components/notifications/
  readme.md                # This file
  type.ts                  # Notification types, interfaces, enums
  event.ts                 # Event emitters/listeners for notification triggers (future)
  action.ts                # Core notification logic (send, fetch, mark as read, etc.)
  telegram.ts              # Telegram notification channel (primary)
  whatsapp.ts              # WhatsApp notification channel (secondary)
  NotificationList.tsx     # UI for notification list in-app
  NotificationIcon.tsx     # Sidebar icon with badge/indicator
```

---

## How It Works

1. **Triggering an Event:**
   - When a user completes onboarding (or any other event), an event is emitted (e.g. `onboarding:submitted`).
2. **Notification Service:**
   - Listens for events and creates notification objects.
   - Sends notifications to the appropriate channels (in-app, Telegram, WhatsApp, etc.).
3. **In-App Notifications:**
   - Stored in the database and fetched for display in the UI (e.g. notification list, sidebar icon).
4. **External Channels:**
   - **Telegram (Primary):** Free, reliable and feature-rich API for sending notifications to admins
   - **WhatsApp (Secondary):** Alternative option for critical notifications (requires paid API)
5. **Sidebar Indicator:**
   - The sidebar icon component checks for unread notifications and displays a badge if there are new ones.

---

## Example: Onboarding Review Notification
- When a new member submits their onboarding process and reaches the review step:
  - Emit an event: `onboarding:submitted` with user info.
  - The notification service creates an in-app notification for admins/reviewers.
  - The sidebar icon shows a badge for new notifications.
  - **Primary:** A Telegram message is sent to individual admins or a notifications channel.
  - Optional: A WhatsApp message is sent to the reviewer group (if configured).

---

## First Step Implementation: Telegram Notifications for Onboarding Completion

### Overview
This section outlines the implementation of Telegram notifications for when new users complete their onboarding process. The system will:
1. Send in-app notifications to administrators/reviewers
2. Send Telegram notifications to specific chat IDs and/or a notifications channel
3. Update the notification badge in the sidebar
4. Optionally send WhatsApp notifications if configured (secondary channel)

### Why Telegram?
Telegram was chosen as the primary external notification channel for several reasons:
- **Free:** No costs associated with the Telegram Bot API
- **Easy Setup:** Creating a bot takes minutes with BotFather
- **Rich Features:** HTML formatting, buttons, and other interactive elements
- **Reliable Delivery:** Messages are delivered instantly even with poor connectivity
- **Group & Channel Support:** Can send to individual admins, groups, or broadcast channels
- **Privacy:** Users interact with your bot without sharing personal phone numbers

### Implementation Status

✅ The following components have been implemented:

1. **Database Schema:**
   - Added `Notification` model to store in-app notifications
   - Updated `User` model with relation to notifications
   
2. **Notification Core:**
   - Created type definitions in `type.ts`
   - Implemented notification actions in `action.ts`
   - Added Telegram handler in `telegram.ts` (primary)
   - Added WhatsApp handler in `whatsapp.ts` (secondary)
   
3. **UI Components:**
   - Created notification icon with badge in `NotificationIcon.tsx`
   - Built notification list in `NotificationList.tsx`
   - Updated sidebar to use the notification icon
   - Enhanced notifications page
   
4. **Integration with Onboarding:**
   - Modified `completeOnboarding()` in `src/components/onboarding/review/action.ts` to:
     - Keep the existing email notification via `notifyNewApplication()`
     - Send Telegram notifications to admins and channels
     - Optionally send WhatsApp notifications if configured

### Required Files and Changes

#### 1. Database Schema (`prisma/schema.prisma`)
Added Notification model to store in-app notifications:

```prisma
model Notification {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  content     String
  userId      String?   @db.ObjectId  // Optional: the user this notification is for
  type        String    // "ONBOARDING_SUBMITTED", "APPLICATION_APPROVED", etc.
  isRead      Boolean   @default(false)
  metadata    Json?     // Additional data related to notification
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([isRead])
}
```

#### 2. Telegram Notification Handler (`src/components/notifications/telegram.ts`)

```typescript
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
```

#### 3. Notification Actions (`src/components/notifications/action.ts`)

```typescript
'use server';

import { db } from '@/lib/db';
import { NotificationType, NotificationPayload } from './type';
import { currentUser } from '@/lib/auth';
import { sendTelegramNotification, sendChannelNotification } from './telegram';
import { sendWhatsAppNotification } from './whatsapp';

/**
 * Create an onboarding submission notification for admins
 */
export async function notifyOnboardingSubmission(
  applicantName: string,
  applicantId: string,
  applicantEmail?: string | null,
  applicantPhone?: string | null,
  applicantWhatsapp?: string | null,
) {
  try {
    // 1. Get admin users to notify
    const admins = await db.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'MEMBERSHIP' },
        ],
      },
      select: {
        id: true,
      },
    });
    
    // 2. Create in-app notifications for each admin
    for (const admin of admins) {
      await createNotification({
        title: 'طلب عضوية جديد',
        content: `قام ${applicantName} بتقديم طلب عضوية جديد وهو بانتظار المراجعة`,
        recipientId: admin.id,
        type: NotificationType.ONBOARDING_SUBMITTED,
        metadata: {
          applicantId,
          applicantName,
          applicantEmail,
          applicantPhone,
          applicantWhatsapp,
        },
      });
    }
    
    // 3. Send Telegram notification (PRIMARY CHANNEL)
    if (process.env.TELEGRAM_NOTIFICATIONS_ENABLED === "true") {
      // Send to specific admin chat IDs if defined
      if (process.env.MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID) {
        await sendTelegramNotification({
          chatId: process.env.MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID,
          message: `<b>طلب عضوية جديد</b>\n\nالاسم: ${applicantName}\nالبريد الإلكتروني: ${applicantEmail || 'غير متوفر'}\nرقم الهاتف: ${applicantPhone || 'غير متوفر'}\n\nيرجى مراجعة الطلب في لوحة التحكم.`,
        });
      }
      
      // Send to a channel if defined
      if (process.env.MEMBERSHIP_NOTIFICATIONS_CHANNEL) {
        await sendChannelNotification(
          `<b>طلب عضوية جديد</b>\n\nالاسم: ${applicantName}\nالبريد الإلكتروني: ${applicantEmail || 'غير متوفر'}\n\nيرجى مراجعة الطلب في لوحة التحكم.`,
          process.env.MEMBERSHIP_NOTIFICATIONS_CHANNEL
        );
      }
    }
    
    // 4. Send WhatsApp notification if configured (SECONDARY CHANNEL)
    if (process.env.WHATSAPP_NOTIFICATIONS_ENABLED === "true" && 
        process.env.MEMBERSHIP_SECRETARY_WHATSAPP) {
      await sendWhatsAppNotification({
        to: process.env.MEMBERSHIP_SECRETARY_WHATSAPP,
        message: `طلب عضوية جديد: ${applicantName}. يرجى مراجعة الطلب في لوحة التحكم.`,
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending onboarding submission notification:', error);
    return { success: false, error };
  }
}
```

### Configuration and Setup for Telegram

1. **Create a Telegram Bot**
   - Start a chat with BotFather (@BotFather) on Telegram
   - Send the command `/newbot` and follow instructions
   - Once created, BotFather will provide a bot token (e.g., `7532530964:AAHWWKT9yNv1SbZpSj6hJtCBBm0ScoGiX4g`)

2. **Environment Variables**
   Add to your `.env` file:
   ```
   # Telegram notification settings (PRIMARY CHANNEL)
   TELEGRAM_NOTIFICATIONS_ENABLED=true
   TELEGRAM_BOT_TOKEN=7532530964:AAHWWKT9yNv1SbZpSj6hJtCBBm0ScoGiX4g
   
   # WhatsApp notification settings (SECONDARY CHANNEL)
   WHATSAPP_NOTIFICATIONS_ENABLED=false
   ```

3. **Get Chat IDs**
   - Start a chat with your new bot (e.g., @nmbdsd_bot)
   - Send any message (e.g., "Hello")
   - Visit URL in browser: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat_id in the response JSON and add it to your .env:
   ```
   MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID=123456789
   ```
   
4. **Channel Setup (Optional but Recommended)**
   - Create a channel in Telegram for all membership notifications
   - Add your bot as an administrator with posting permissions
   - Use the channel username in your .env:
   ```
   MEMBERSHIP_NOTIFICATIONS_CHANNEL=@membership_notifications
   ```

5. **Testing with Lab Page**
   - Use the `/lab` page in the application to test your Telegram notifications
   - Enter your bot token, chat ID, and test messages
   - Verify messages are received in your Telegram app

## Next Steps

1. **Testing and Verification:**
   - Test the onboarding completion flow to ensure Telegram notifications are sent
   - Verify the notification badge appears in sidebar with the correct count
   - Check that the notifications page displays the notifications

2. **Future Enhancements:**
   - Add interactive buttons to Telegram notifications for quick actions (approve/reject)
   - Implement more notification types (application approved/rejected)
   - Add support for message formatting and rich media attachments
   - Create notification templates for consistent messaging
   - Implement multi-language support for notifications

## Best Practices
- Use HTML formatting in Telegram messages for better readability
- Keep messages concise and actionable
- Include relevant information but avoid sensitive data
- Provide clear calls-to-action in notification messages
- Test message delivery on both mobile and desktop Telegram clients 