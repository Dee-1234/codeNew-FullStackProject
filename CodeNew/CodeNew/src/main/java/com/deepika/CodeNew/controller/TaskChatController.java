package com.deepika.CodeNew.controller;

import com.deepika.CodeNew.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class TaskChatController {

    private final SimpMessageSendingOperations messagingTemplate;

    /**
     * EXISTING: 1-to-1 Private Chat
     * Used for notifications or private mentor feedback.
     */
    @MessageMapping("/chat.sendFeedback")
    public void sendFeedback(@Payload ChatMessage chatMessage) {
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipient(),
                "/queue/messages",
                chatMessage
        );
    }

    /**
     * NEW: Real-Time Code Collaboration
     * This broadcasts code changes to a "Topic" so everyone
     * in the session (Mentor + Student) stays in sync.
     */
    @MessageMapping("/chat.syncCode")
    public void syncCode(@Payload ChatMessage chatMessage) {
        // We use /topic/task/{id} as the room name
        // On the frontend, both Mentor and Student must subscribe to this same path
        String sessionTopic = "/topic/task/" + chatMessage.getRecipient();

        messagingTemplate.convertAndSend(sessionTopic, chatMessage);
    }
}