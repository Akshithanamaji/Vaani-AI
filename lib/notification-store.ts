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
    } catch (error) {
        console.error('Error writing notifications file:', error);
    }
}

let notifications: AppNotification[] = getNotificationsFromFile();

export function addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    // Reload to ensure we have latest state
    notifications = getNotificationsFromFile();
    
    const newNotif: AppNotification = {
        ...notif,
        id: `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        read: false
    };
    notifications.push(newNotif);
    saveNotificationsToFile(notifications);
    return newNotif;
}

export function getNotifications(userEmail: string) {
    // Reload to ensure we have latest state
    notifications = getNotificationsFromFile();
    return notifications.filter(n => n.userEmail === userEmail).sort((a, b) => b.timestamp - a.timestamp);
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
    notifications = notifications.filter(n => n.userEmail !== userEmail);
    saveNotificationsToFile(notifications);
}
