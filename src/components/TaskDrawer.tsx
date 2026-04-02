"use client";

import React, { useState } from 'react';
import { useTaskChat } from '../hooks/useTaskChat';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
}

interface User {
    email: string;
    role: string;
}

interface TaskDrawerProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    recipientEmail: string; // Added to handle dynamic messaging
}

export default function TaskDrawer({ 
    task, 
    isOpen, 
    onClose, 
    currentUser, 
    recipientEmail 
}: TaskDrawerProps) {
    const [message, setMessage] = useState("");
    
    // The hook listens for messages sent to the CURRENT user
    const { messages, sendFeedback } = useTaskChat(currentUser.email);

    if (!isOpen) return null;

    const handleSend = () => {
        if (message.trim()) {
            // Now sends to whoever is passed as the recipient
            sendFeedback(message, recipientEmail, task.id);
            setMessage("");
        }
    };

    return (
        <div className={`fixed right-0 top-0 h-full w-96 bg-slate-900 shadow-2xl border-l border-slate-800 z-50 p-6 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white truncate">{task.title}</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">✕</button>
            </div>
            
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{task.description}</p>

            <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 rounded bg-blue-900/30 text-blue-400 text-xs font-semibold uppercase">
                    {task.status}
                </span>
            </div>

            <hr className="border-slate-800 mb-6" />

            <h3 className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-widest">
                {currentUser.role === 'MENTOR' ? 'Chat with Student' : 'Mentor Discussion'}
            </h3>
            
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender === currentUser.email ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-500 mb-1 px-1">
                            {msg.sender === currentUser.email ? 'You' : msg.sender}
                        </span>
                        <div className={`px-3 py-2 rounded-2xl max-w-[90%] text-sm ${
                            msg.sender === currentUser.email 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                <input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type feedback..."
                    className="flex-1 bg-transparent text-white px-2 py-1 text-sm focus:outline-none"
                />
                <button 
                    onClick={handleSend} 
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all shadow-lg active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    );
}