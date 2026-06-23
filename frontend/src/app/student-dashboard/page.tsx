"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { 
  LayoutDashboard, CircleDot, Video, ArrowRight, Code2, 
  Terminal, Sparkles, Play, Loader2, XCircle, LogOut, 
  Send, MessageSquare 
} from 'lucide-react';
import Editor from '@monaco-editor/react';

// Interfaces for type safety
interface User { email: string; role: string; }
interface TokenPayload { sub: string; role: string; }
interface Message { text: string; sender: 'me' | 'mentor'; id: number; }

export default function StudentDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [activeLang, setActiveLang] = useState<'java' | 'python'>('java');
    
    // State for code, execution, and chat
    const [code, setCode] = useState("");
    const [output, setOutput] = useState<string>("");
    const [isRunning, setIsRunning] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "I am starting the debug now.", sender: 'mentor' }
    ]);

    const task = useMemo(() => ({
        id: "task-101",
        title: "Fix Java Exception",
        description: "Debug the NullPointerException in the Controller layer.",
        status: "IN_PROGRESS",
        placeholderCode: {
            java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from CodeNew Java!\");\n    }\n}",
            python: "print(\"Hello from CodeNew Python!\")"
        }
    }), []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            setUser({ email: decoded.sub, role: decoded.role });
            setCode(task.placeholderCode.java);
        } catch { router.push("/login"); }
    }, [router, task.placeholderCode.java]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const handleLangSwitch = (lang: 'java' | 'python') => {
        setActiveLang(lang);
        setCode(task.placeholderCode[lang]);
        setOutput("");
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput("Compiling...");
        try {
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: activeLang,
                    version: activeLang === "java" ? "15.0.2" : "3.10.0",
                    files: [{ content: code }],
                }),
            });
            const data = await response.json();
            setOutput(data.run.output || "Execution finished (no output).");
        } catch {
            setOutput("Error: Execution engine unavailable.");
        } finally {
            setIsRunning(false);
        }
    };

    // Chat Logic
    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        
        const newMessage: Message = {
            id: Date.now(),
            text: chatMessage,
            sender: 'me'
        };

        setMessages([...messages, newMessage]);
        setChatMessage("");
        
        // Note: Integrate your WebSocket (STOMP) send logic here in the future
        console.log("Message sent to mentor:", chatMessage);
    };

    if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="p-8 bg-slate-950 min-h-screen text-white font-sans selection:bg-blue-500/30">
            {/* Header section */}
            <header className="flex justify-between items-center mb-10 border-b border-slate-800/50 pb-8">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl shadow-blue-900/30 ring-1 ring-white/10">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter italic">Student Hub</h1>
                        <p className="text-slate-500 text-xs font-mono mt-1 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={12} className="text-blue-500" /> {user.email}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="flex items-center gap-3 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 rounded-2xl font-black transition-all shadow-xl shadow-emerald-900/20 active:scale-95 text-xs tracking-widest"
                    >
                        {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                        RUN CODE
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-red-900/20 text-slate-400 hover:text-red-500 border border-slate-800 rounded-2xl font-bold transition-all active:scale-95 text-xs tracking-widest"
                    >
                        <LogOut size={18} />
                        LOGOUT
                    </button>

                    <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-slate-900/80 rounded-2xl border border-slate-800">
                        <CircleDot size={14} className="text-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-500/80 uppercase tracking-widest font-black">Live Sync</span>
                    </div>
                </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Task & Chat */}
                <div className="lg:col-span-4 space-y-6 flex flex-col">
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-xl font-black border border-blue-500/20 uppercase tracking-widest mb-6 inline-block">
                            {task.status}
                        </span>
                        <h3 className="font-bold text-3xl mb-4 tracking-tighter leading-none">{task.title}</h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">{task.description}</p>
                        <button 
                            onClick={() => router.push(`/workspace?sessionId=${task.id}`)}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all active:scale-[0.96] shadow-2xl shadow-blue-900/40 text-xs uppercase tracking-widest"
                        >
                            <Video size={18} /> Join Workspace <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Chat Box */}
                    <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden min-h-[350px]">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
                            <MessageSquare size={16} className="text-blue-500" />
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mentor Chat</h2>
                        </div>
                        
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[300px] scrollbar-thin scrollbar-thumb-slate-800">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                                        msg.sender === 'me' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-slate-900/80 border-t border-slate-800">
                            <div className="relative flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Message mentor..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500 transition-all text-white placeholder:text-slate-600"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="bg-blue-600 p-2.5 rounded-xl hover:bg-blue-500 transition-all active:scale-90 text-white"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Code Sandbox */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between pl-1">
                        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                            {(['java', 'python'] as const).map((lang) => (
                                <button 
                                    key={lang}
                                    onClick={() => handleLangSwitch(lang)}
                                    className={`px-6 py-2 text-[10px] font-black rounded-lg transition-all ${activeLang === lang ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-900/50 rounded-[2.5rem] border border-slate-800 overflow-hidden flex flex-col shadow-2xl min-h-[400px]">
                        <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-800 flex items-center gap-3">
                            <Code2 size={18} className="text-blue-500" />
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                                {activeLang === 'java' ? 'Solution.java' : 'main.py'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <Editor 
                                height="100%" 
                                theme="vs-dark" 
                                language={activeLang}
                                value={code} 
                                onChange={(val) => setCode(val || "")}
                                options={{ 
                                    fontSize: 14, 
                                    minimap: { enabled: false }, 
                                    padding: { top: 24 },
                                    fontFamily: 'Fira Code, monospace',
                                }} 
                            />
                        </div>
                    </div>

                    {/* Console at bottom of code */}
                    <div className="bg-black border border-slate-800 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl h-40">
                        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 font-mono">
                                <Terminal size={14} className="text-emerald-500" /> Console
                            </span>
                            <button onClick={() => setOutput("")} className="text-slate-600 hover:text-white transition-colors">
                                <XCircle size={14} />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto font-mono text-[11px] text-emerald-400 bg-slate-950/40 h-full">
                            {output ? <pre className="whitespace-pre-wrap">{output}</pre> : <span className="text-slate-700 italic">No output...</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}