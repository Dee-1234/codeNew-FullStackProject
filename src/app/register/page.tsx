"use client";

import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    role: "ROLE_STUDENT" 
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        await api.post("/auth/register", formData);
        alert("Account created successfully!");
        router.push("/login");
    } catch (err: unknown) { // Use 'unknown' instead of 'any'
        console.error("Registration failed:", err);
        
      // Narrow the type to check if it's an Axios error
        if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || "Registration failed. Is the Backend running?";
        alert(errorMessage);
        } else {
        alert("An unexpected error occurred. Please try again.");
        }
    } finally {
        setIsLoading(false);
    }
    };

    return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200 px-4">
        <div className="w-full max-w-md p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500 border border-blue-500/20">
            <UserPlus size={32} />
            </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Create Account
        </h2>
        <p className="text-center text-slate-500 text-sm mb-8">
            Join the CodeNew 1:1 mentorship platform
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
            <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
            />
            </div>

          {/* Password Input */}
            <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input 
                type="password" 
                placeholder="Create Password" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
            />
            </div>

          {/* Role Selection */}
            <div className="relative">
            <ShieldCheck className="absolute left-3 top-3 w-5 h-5 text-slate-500 pointer-events-none" />
            <select 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer transition-all"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                value={formData.role}
            >
                <option value="ROLE_STUDENT" className="bg-slate-900">I am a Student</option>
                <option value="ROLE_MENTOR" className="bg-slate-900">I am a Mentor</option>
            </select>
            <div className="absolute right-3 top-3 pointer-events-none">
                <ArrowRight size={16} className="text-slate-500 rotate-90" />
            </div>
            </div>

          {/* Submit Button */}
            <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
            {isLoading ? (
                <>
                <Loader2 className="animate-spin" size={20} />
                <span>Processing...</span>
                </>
            ) : (
                <span>Get Started</span>
            )}
            </button>
        </form>
        
        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign In
            </Link>
        </p>
        </div>
    </div>
    );
}