"use client";

import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// The interface we created to fix the 'any' error earlier
interface ChatMessage {
    type: 'CHAT' | 'JOIN' | 'LEAVE';
    content: string;
    sender: string;
    recipient: string;
    taskId?: string;
}

export const useTaskChat = (currentUserEmail: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        // 1. Handshake with the /ws-code endpoint you just configured in Java
        const socket = new SockJS("http://localhost:8080/ws-code");
        
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Chat Connected as:", currentUserEmail);

                // 2. THIS IS THE LINE: The Mentor listens to their own private queue
                client.subscribe(`/user/${currentUserEmail}/queue/messages`, (payload) => {
                    const msg: ChatMessage = JSON.parse(payload.body);
                    
                    // Add the incoming message to the chat history
                    setMessages((prev) => [...prev, msg]);
                });
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [currentUserEmail]); // Re-run if the user logs out/in as someone else

    const sendFeedback = (content: string, recipientEmail: string, taskId: string) => {
        if (stompClient.current?.connected) {
            const msg: ChatMessage = {
                sender: currentUserEmail,
                recipient: recipientEmail,
                content: content,
                type: 'CHAT',
                taskId: taskId
            };

            stompClient.current.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(msg)
            });

            // Show your own message in the UI immediately
            setMessages((prev) => [...prev, msg]);
        }
    };

    return { messages, sendFeedback };
};