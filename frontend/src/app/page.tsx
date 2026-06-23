import Image from "next/image";
import Link from "next/link";
import { Terminal, ArrowRight, Code2, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-blue-500">
          <Terminal size={24} />
          <span className="text-xl font-bold tracking-tight text-white">CodeNew</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Hero Section */}
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time 1:1 Mentorship Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
            Master Code with <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Expert Guidance
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
            A collaborative workspace designed for mentors and students. 
            Pair program in real-time, solve complex problems, and synchronize your progress instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/register" 
              className="flex items-center justify-center gap-2 h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
            >
              Start Coding Now <ArrowRight size={20} />
            </Link>
            <Link 
              href="/docs" 
              className="flex items-center justify-center h-14 px-8 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
            >
              View Documentation
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full">
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-left space-y-3">
            <div className="p-2 w-fit bg-blue-600/10 rounded-lg text-blue-500">
              <Code2 size={24} />
            </div>
            <h3 className="font-bold text-lg">Shared Editor</h3>
            <p className="text-slate-400 text-sm">Monaco-powered editor with real-time STOMP synchronization.</p>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-left space-y-3">
            <div className="p-2 w-fit bg-indigo-600/10 rounded-lg text-indigo-500">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-lg">1:1 Mentorship</h3>
            <p className="text-slate-400 text-sm">Dedicated roles for Students and Mentors with secure JWT access.</p>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-left space-y-3">
            <div className="p-2 w-fit bg-emerald-600/10 rounded-lg text-emerald-500">
              <Terminal size={24} />
            </div>
            <h3 className="font-bold text-lg">Java Support</h3>
            <p className="text-slate-400 text-sm">Full Spring Boot integration optimized for high-performance sync.</p>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t border-slate-900 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} CodeNew Platform. Built for developers by developers.
      </footer>
    </div>
  );
}