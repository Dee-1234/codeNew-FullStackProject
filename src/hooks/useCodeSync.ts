"use client";

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 1. Updated signature to accept 'taskId' as the second argument
export const useCodeSync = (onCodeReceived: (code: string) => void, taskId: string) => {
    const stompClient = useRef<Client | null>(null);
    const callbackRef = useRef(onCodeReceived);

    useEffect(() => {
        callbackRef.current = onCodeReceived;
    }, [onCodeReceived]);

    useEffect(() => {
        // Ensure this URL matches your Spring Boot 'registerStompEndpoints' path
        const socket = new SockJS("http://localhost:8080/ws-code"); 
        
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log(`Connected to WebSocket - Syncing Task: ${taskId}`);
                
                // 2. Subscribe to a Dynamic Topic based on taskId
                client.subscribe(`/topic/code-sync/${taskId}`, (message) => {
                    if (message.body) {
                        callbackRef.current(message.body);
                    }
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
    }, [taskId]); // 3. Re-run if taskId changes

    const sendCodeUpdate = (code: string) => {
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                // 4. Send to a Dynamic Destination
                destination: `/app/code-update/${taskId}`,
                body: code, 
            });
        }
    };

    return { sendCodeUpdate };
};