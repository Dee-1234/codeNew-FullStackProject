package com.deepika.CodeNew.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    private MessageType type;
    private String content;
    private String sender;    // The email of the person sending
    private String recipient; // The email of the Mentor or Student
    private String taskId; // CRITICAL: Link the chat to the specific task


    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public enum MessageType {
        CHAT,
        CODE_UPDATE,
        JOIN,
        LEAVE
    }
}