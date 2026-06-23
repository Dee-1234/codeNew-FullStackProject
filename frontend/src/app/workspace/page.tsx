"use client";
import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MessageSquare, Code, Send, Video, Mic, LogOut, VideoOff, MicOff, Loader2, Users } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { jwtDecode } from "jwt-decode";
import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';

// --- Types ---
interface User { email: string; role: string; }
interface ChatMessage { type: 'CODE_UPDATE' | 'CHAT' | 'JOIN' | 'LEAVE'; content: string; sender: string; recipient: string; }
interface TokenPayload { sub: string; role: string; }

function WorkspaceContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('sessionId') || 'demo-session';
    
    const [code, setCode] = useState<string>("// Happy Coding!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const myVideoRef = useRef<HTMLVideoElement>(null);
    const stompClient = useRef<CompatClient | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // ✅ Fix 1: Auto-scroll Chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ✅ Fix 2: Better Auth & Camera Handling
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const decoded = jwtDecode<TokenPayload>(token);
            queueMicrotask(() => {
                setUser((prev) => (prev?.email === decoded.sub ? prev : { email: decoded.sub, role: decoded.role }));
            });

            // Handle Camera Error Gracefully
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(stream => {
                    if (myVideoRef.current) myVideoRef.current.srcObject = stream;
                })
                .catch(err => console.warn("Media device not found - proceeding in demo mode", err));

        } catch {
            router.push("/login");
        }
    }, [router]);

    // ✅ Fix 3: Proper STOMP Factory Pattern
    useEffect(() => {
        if (!user) return;

        const socketFactory = () => new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socketFactory);
        client.debug = () => {}; 

        client.connect({}, () => {
            stompClient.current = client;
            setIsConnected(true);

            client.subscribe(`/topic/session/${sessionId}`, (payload) => {
                const data: ChatMessage = JSON.parse(payload.body);
                if (data.type === 'CODE_UPDATE') {
                    if (data.sender !== user.email) setCode(data.content);
                } else {
                    setMessages(prev => [...prev, data]);
                }
            });

            const joinMsg: ChatMessage = {
                type: 'JOIN',
                content: `${user.email} joined`,
                sender: user.email,
                recipient: sessionId
            };
            client.send(`/app/chat.syncCode`, {}, JSON.stringify(joinMsg));
        });

        return () => {
            if (stompClient.current) stompClient.current.disconnect();
        };
    }, [sessionId, user]);

    const handleEditorChange = useCallback((value: string | undefined) => {
        const newCode = value || "";
        setCode(newCode);
        if (user && stompClient.current?.connected) {
            stompClient.current.send(`/app/chat.syncCode`, {}, JSON.stringify({
                type: 'CODE_UPDATE', content: newCode, sender: user.email, recipient: sessionId
            }));
        }
    }, [sessionId, user]);

    const sendChatMessage = () => {
        if (!user || !input.trim() || !stompClient.current?.connected) return;
        stompClient.current.send(`/app/chat.syncCode`, {}, JSON.stringify({
            type: 'CHAT', content: input, sender: user.email, recipient: sessionId
        }));
        setInput("");
    };

    if (!user || !isConnected) return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
            <Loader2 className="text-emerald-500 animate-spin" size={48} />
            <p className="text-emerald-500 font-mono text-sm animate-pulse uppercase tracking-widest">Initialising Workspace...</p>
        </div>
    );

    return (
        <div className="flex h-screen w-full bg-slate-950 text-white overflow-hidden font-sans">
            {/* ASIDE: Video Tools (Locked Width) */}
            <aside className="w-72 flex-shrink-0 border-r border-slate-800 p-4 flex flex-col gap-4 bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Session</h2>
                    <button onClick={() => router.back()} className="text-slate-500 hover:text-red-400 transition-colors"><LogOut size={18} /></button>
                </div>
                
                <div className="aspect-video bg-black rounded-2xl border border-slate-700 overflow-hidden relative shadow-inner">
                    <video ref={myVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : 'block'}`} />
                    {isVideoOff && <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-700"><VideoOff size={24}/></div>}
                    <div className="absolute bottom-2 left-2 bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold">You</div>
                </div>

                <div className="aspect-video bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden relative flex items-center justify-center border-dashed">
                    <div className="text-center opacity-30">
                        <Users size={20} className="mx-auto mb-1" />
                        <p className="text-[8px] font-mono uppercase tracking-tighter">Awaiting Peer</p>
                    </div>
                </div>

                <div className="flex justify-center gap-3 mt-auto mb-4 bg-slate-800/20 p-3 rounded-3xl border border-slate-800/50">
                    <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full border transition-all ${isMuted ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
                        {isMuted ? <MicOff size={16}/> : <Mic size={16}/>}
                    </button>
                    <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 rounded-full border transition-all ${isVideoOff ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
                        {isVideoOff ? <VideoOff size={16}/> : <Video size={16}/>}
                    </button>
                </div>
            </aside>

            {/* MAIN: Code Editor (Expands to fill) */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-14 border-b border-slate-800 flex justify-between items-center px-6 bg-slate-900/10">
                    <div className="flex items-center gap-3">
                        <Code size={16} className="text-emerald-500" />
                        <span className="font-mono text-sm text-slate-300">Solution.java</span>
                    </div>
                    <div className="bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700 text-[10px] font-mono text-emerald-500">Connected</div>
                </header>
                <div className="flex-1">
                    <Editor height="100%" theme="vs-dark" defaultLanguage="java" value={code} onChange={handleEditorChange} options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 20 } }} />
                </div>
            </main>

            {/* SECTION: Chat Panel (Locked Width) */}
            <section className="w-80 flex-shrink-0 border-l border-slate-800 flex flex-col bg-slate-950/50 backdrop-blur-md">
                <div className="p-5 border-b border-slate-800 font-bold text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <MessageSquare size={14} className="text-emerald-500" /> Live Chat
                </div>
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === user.email ? 'items-end' : 'items-start'}`}>
                            {msg.type === 'CHAT' ? (
                                <>
                                    <div className={`p-3 rounded-2xl text-sm max-w-[90%] shadow-lg border ${msg.sender === user.email ? 'bg-emerald-600 border-emerald-500 text-white rounded-tr-none' : 'bg-slate-800 border-slate-700 text-slate-200 rounded-tl-none'}`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] text-slate-600 mt-1.5 px-1 font-mono uppercase">{msg.sender.split('@')[0]}</span>
                                </>
                            ) : (
                                <span className="text-[10px] text-slate-500 italic w-full text-center py-2 font-mono opacity-50">{msg.content}</span>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-slate-800 flex gap-2 bg-slate-900/20">
                    <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()} placeholder="Type message..." className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm flex-1 outline-none focus:border-emerald-500" />
                    <button onClick={sendChatMessage} className="bg-emerald-600 p-2.5 rounded-xl hover:bg-emerald-500"><Send size={18}/></button>
                </div>
            </section>
        </div>
    );
}

export default function CollaborativeWorkspace() {
    return (
        <Suspense fallback={<div className="h-screen bg-slate-950" />}>
            <WorkspaceContent />
        </Suspense>
    );
}