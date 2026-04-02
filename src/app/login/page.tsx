"use client";

import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import { Lock, Mail, Terminal, Loader2 } from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // CRITICAL: Ensure this is imported

interface TokenPayload {
    sub: string;
    role: string; // The backend should return ROLE_STUDENT or ROLE_MENTOR
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
    message: string;
}

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await api.post("/auth/login", { email, password });

            // 1. Extract Token (Handling both string and object responses)
            const token = typeof data === "string" ? data : data?.token;

            if (token && token.split('.').length === 3) {
                localStorage.setItem("token", token);
                
                // 2. DECODE the real role from the JWT
                const decoded = jwtDecode<TokenPayload>(token);
                const userRole = decoded.role; // This is the source of truth

                // 3. Save User Info for quick access
                localStorage.setItem("user", JSON.stringify({ 
                    email: decoded.sub, 
                    role: userRole 
                }));

                console.log(`Role: ${userRole}. Routing now...`);

                // 4. THE SPLIT: Route based on the decoded role
                if (userRole === "ROLE_MENTOR") {
                    router.push("/mentor-dashboard");
                } else {
                    router.push("/student-dashboard");
                }
                
            } else {
                throw new Error("Invalid Token Structure");
            }
        }catch (err: unknown) {
    const error = err as AxiosErrorResponse;
    console.error("Login failed:", error);
    
    const msg = error.response?.data?.message || error.message || "Check your credentials.";
    alert(`Login failed: ${msg}`);
    } finally {
    setIsLoading(false);
    }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
            <div className="w-full max-w-md p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500">
                        <Terminal size={32} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    CodeNew
                </h2>
                <p className="text-center text-slate-500 text-sm mb-8">Access your personalized dashboard</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                        <input
                            type="email"
                            autoComplete="email"
                            placeholder="Email Address"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center flex flex-col gap-2">
                     <p className="text-xs text-slate-600">Demo Tip: Use mentor@gmail.com for Mentor view</p>
                    <p className="text-sm text-slate-500">
                        New to CodeNew?{" "}
                        <Link href="/register" className="text-blue-400 hover:underline font-semibold">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}