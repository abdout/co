'use server';

import { db } from '@/lib/db';
import { NotificationType, NotificationPayload } from './type';
import { currentUser } from '@/lib/auth';
import { sendWhatsAppNotification } from './whatsapp';
import { sendTelegramNotification, sendChannelNotification } from './telegram';

/**
 * Create a new in-app notification
 */
export async function createNotification(data: NotificationPayload) {
  return db.notification.create({
    data: {
      title: data.title,
      content: data.content,
      userId: data.recipientId,
      type: data.type,
      metadata: data.metadata || {},
    },
  });
}

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
    
    // 3. Send WhatsApp notification if configured
    if (process.env.WHATSAPP_NOTIFICATIONS_ENABLED === "true" && 
        process.env.MEMBERSHIP_SECRETARY_WHATSAPP) {
      await sendWhatsAppNotification({
        to: process.env.MEMBERSHIP_SECRETARY_WHATSAPP,
        message: `طلب عضوية جديد: ${applicantName}. يرجى مراجعة الطلب في لوحة التحكم.`,
      });
    }
    
    // 4. Send Telegram notification if configured
    if (process.env.TELEGRAM_NOTIFICATIONS_ENABLED === "true") {
      // Send to specific admin chat IDs if defined
      if (process.env.MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID) {
        await sendTelegramNotification({
          chatId: process.env.MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID,
          message: `<b>طلب عضوية جديد</b>\n\nالاسم: ${applicantName}\nالبريد الإلكتروني: ${applicantEmail || 'غير متوفر'}\nرقم الهاتف: ${applicantPhone || 'غير متوفر'}\n\nيرجي مراجعة الطلب من هنا:\nnmbdsd.org/dashboard/membership`,
        });
      }
      
      // Send to a channel if defined
      if (process.env.MEMBERSHIP_NOTIFICATIONS_CHANNEL) {
        await sendChannelNotification(
          `<b>طلب عضوية جديد</b>\n\nالاسم: ${applicantName}\nالبريد الإلكتروني: ${applicantEmail || 'غير متوفر'}\n\nيرجي مراجعة الطلب من هنا:\nnmbdsd.org/dashboard/membership`,
          process.env.MEMBERSHIP_NOTIFICATIONS_CHANNEL
        );
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending onboarding submission notification:', error);
    return { success: false, error };
  }
}

/**
 * Get unread notifications count for the current user
 */
export async function getUnreadNotificationsCount() {
  try {
    const user = await currentUser();
    if (!user?.id) return 0;
    
    return db.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    return 0;
  }
}

/**
 * Get notifications for the current user
 */
export async function getUserNotifications(limit = 10, offset = 0) {
  try {
    const user = await currentUser();
    if (!user?.id) return [];
    
    return db.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const user = await currentUser();
    if (!user?.id) return { success: false, error: 'Unauthorized' };
    
    await db.notification.update({
      where: {
        id: notificationId,
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }
} 