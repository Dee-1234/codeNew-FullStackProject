package com.deepika.CodeNew.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class CodeSyncController {

    @MessageMapping("/code-update") // Clients send to /app/code-update
    @SendTo("/topic/code-sync")      // Server broadcasts to /topic/code-sync
    public String shareCode(String code) {
        // In the future, we can add logic here to save the code to a DB
        return code;
    }
}