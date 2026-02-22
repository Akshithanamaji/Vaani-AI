import fs from 'fs';
import path from 'path';

export interface AppNotification {
    id: string;
    userEmail: string;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info' | 'error';
    timestamp: number;
    read: boolean;
    serviceName?: string;
    /** Submission ID for reference */
    submissionId?: string;
}

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'data', 'notifications.json');

// Helper to read notifications from file
function getNotificationsFromFile(): AppNotification[] {
    try {
        if (fs.existsSync(NOTIFICATIONS_FILE)) {
            const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading notifications file:', error);
    }
    return [];
}

// Helper to save notifications to file
function saveNotificationsToFile(notifications: AppNotification[]) {
    try {
        const dir = path.dirname(NOTIFICATIONS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2), 'utf-8');
        console.log('[NotificationStore] Saved', notifications.length, 'notifications to:', NOTIFICATIONS_FILE);
    } catch (error) {
        console.error('[NotificationStore] Error writing notifications file:', error, {
            filePath: NOTIFICATIONS_FILE,
            errorMessage: error instanceof Error ? error.message : String(error)
        });
    }
}

let notifications: AppNotification[] = getNotificationsFromFile();

export function addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    // Reload to ensure we have latest state
    notifications = getNotificationsFromFile();
    
    // Normalize email: trim whitespace and convert to lowercase
    const normalizedEmail = notif.userEmail.trim().toLowerCase();
    
    const newNotif: AppNotification = {
        ...notif,
        userEmail: normalizedEmail,
        id: `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        read: false
    };
    notifications.push(newNotif);
    saveNotificationsToFile(notifications);
    console.log('[NotificationStore] Added notification:', {
        userEmail: normalizedEmail,
        title: notif.title,
        timestamp: newNotif.timestamp,
        id: newNotif.id
    });
    return newNotif;
}

export function getNotifications(userEmail: string) {
    // Reload to ensure we have latest state
    notifications = getNotificationsFromFile();
    
    // Normalize email: trim whitespace and convert to lowercase
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    return notifications.filter(n => n.userEmail === normalizedEmail).sort((a, b) => b.timestamp - a.timestamp);
}

export function markAsRead(id: string) {
    // Reload to ensure we have latest state
    notifications = getNotificationsFromFile();
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotificationsToFile(notifications);
}

export function clearAll(userEmail: string) {
    // Reload to ensure we have latest state
    notifications = getNotificationsFromFile();
    
    // Normalize email: trim whitespace and convert to lowercase
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    notifications = notifications.filter(n => n.userEmail !== normalizedEmail);
    saveNotificationsToFile(notifications);
}

