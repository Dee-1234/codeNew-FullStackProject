"use client";
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Users, Code2, Terminal, LogOut, Send, MessageSquare } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface MentorTask {
    id: string;
    title: string;
    status: string;
    student: string;
    initialCode: string;
}

interface ChatMessage {
    id: number;
    text: string;
    sender: 'mentor' | 'system' | 'student';
}

export default function MentorDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'info' | 'code'>('info');
    const [message, setMessage] = useState("");
    
    // 1. Added messages state
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { id: 1, text: "Student is struggling with the loop logic.", sender: 'system' }
    ]);
    
    const task = useMemo<MentorTask>(() => ({
        id: "task-101",
        title: "Fix Java Exception",
        status: "ACTIVE",
        student: "student@gmail.com",
        initialCode: "// Student's current snippet\npublic class Solution {\n    public static void main(String[] args) {\n        // Code needs review\n    }\n}"
    }), []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    // 2. Function to handle sending messages
    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMsg: ChatMessage = {
            id: Date.now(),
            text: message,
            sender: 'mentor'
        };

        setChatHistory([...chatHistory, newMsg]);
        setMessage("");

        // FUTURE: Add WebSocket/STOMP logic here to broadcast to the student
        console.log("Sending hint to student:", message);
    };

    return (
        <div className="p-8 bg-slate-950 min-h-screen text-white border-t-8 border-emerald-600 font-sans">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter italic">Review Board</h1>
                    <p className="text-emerald-500 text-sm font-mono mt-1 uppercase tracking-widest">Live Mentorship Console</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                        <div className="px-4 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">1 Active</div>
                        <Users className="text-slate-500 mr-2" size={20} />
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-red-900/20 text-slate-400 hover:text-red-500 border border-slate-800 rounded-2xl font-bold transition-all active:scale-95 text-xs tracking-widest"
                    >
                        <LogOut size={18} />
                        LOGOUT
                    </button>
                </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Task Card */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl border-l-4 border-l-emerald-500">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-500/20 uppercase tracking-widest animate-pulse">
                                {task.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-2xl mb-2 tracking-tight text-slate-100">{task.title}</h3>
                        <p className="text-xs text-slate-500 font-mono mb-8">{task.student}</p>
                        
                        <div className="space-y-3">
                            <button 
                                onClick={() => router.push(`/workspace?sessionId=${task.id}`)}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-900/30 text-xs uppercase tracking-widest"
                            >
                                <Video size={18} /> LIVE SESSION
                            </button>
                            <button 
                                onClick={() => setActiveTab(activeTab === 'info' ? 'code' : 'info')}
                                className="w-full bg-slate-800/50 hover:bg-slate-800 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all text-slate-400 text-xs uppercase tracking-widest border border-slate-700"
                            >
                                <Code2 size={16} /> {activeTab === 'info' ? 'Peek Code' : 'Task Info'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Center: Code Preview */}
                <div className="lg:col-span-6 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
                    <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800 flex items-center gap-3">
                        <Terminal size={18} className="text-emerald-500" />
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Preview: Solution.java</span>
                    </div>
                    <div className="flex-1">
                        <Editor 
                            height="100%" 
                            theme="vs-dark" 
                            defaultLanguage="java" 
                            value={task.initialCode} 
                            options={{ fontSize: 14, minimap: { enabled: false }, readOnly: true, padding: { top: 20 }, fontFamily: 'Fira Code, monospace' }} 
                        />
                    </div>
                </div>

                {/* Right: Collaboration Chat */}
                <div className="lg:col-span-3 bg-slate-900/50 rounded-3xl border border-slate-800 flex flex-col shadow-2xl overflow-hidden min-h-[500px]">
                    <div className="p-5 border-b border-slate-800 flex items-center gap-2 bg-slate-900">
                        <MessageSquare size={16} className="text-emerald-500" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Review Chat</h2>
                    </div>

                    {/* 3. Rendered Dynamic Messages */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans max-h-[350px]">
                        {chatHistory.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'mentor' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[90%] border ${
                                    msg.sender === 'mentor' 
                                    ? 'bg-emerald-600 text-white rounded-tr-none border-emerald-500' 
                                    : 'bg-slate-800 text-slate-300 rounded-tl-none border-slate-700'
                                }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[9px] text-slate-600 mt-1 font-mono uppercase px-1 tracking-tighter">
                                    {msg.sender === 'system' ? 'System Note' : msg.sender === 'mentor' ? 'You' : 'Student'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-slate-900 border-t border-slate-800">
                        <div className="relative flex items-center gap-2">
                            <input 
                                type="text" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                // 4. Added Enter key support
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Send hint..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700 font-medium"
                            />
                            <button 
                                // 5. Added onClick handler
                                onClick={handleSendMessage}
                                className="bg-emerald-600 p-2.5 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all active:scale-90 flex-shrink-0"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}