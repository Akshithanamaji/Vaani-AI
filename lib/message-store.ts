export interface Message {
    id: string;
    sender: 'user' | 'admin';
    content: string;
    timestamp: number;
    serviceId: number;
    serviceName: string;
    userEmail: string;
    read?: boolean;
}

// In-memory message store
let messages: Message[] = [];

export function getMessagesByUser(userEmail: string) {
    return messages.filter(m => m.userEmail === userEmail).sort((a, b) => a.timestamp - b.timestamp);
}

export function getMessagesByService(serviceId: number) {
    return messages.filter(m => m.serviceId === serviceId).sort((a, b) => a.timestamp - b.timestamp);
}

export function getAllServiceMessages() {
    return messages;
}

export function markMessagesAsRead(userEmail: string, serviceId: number, role: 'user' | 'admin') {
    messages = messages.map(m => {
        if (m.userEmail === userEmail && m.serviceId === serviceId && m.sender !== role) {
            return { ...m, read: true };
        }
        return m;
    });
}

export function sendMessage(msg: Omit<Message, 'id' | 'timestamp'>) {
    const newMessage: Message = {
        ...msg,
        read: false,
        id: `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
    };
    messages.push(newMessage);
    return newMessage;
}

