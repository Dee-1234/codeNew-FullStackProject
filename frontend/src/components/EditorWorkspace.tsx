"use client";

import Editor, { OnChange } from "@monaco-editor/react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useCodeSync } from "../hooks/useCodeSync";

interface EditorProps {
    language: string;
    onCodeChange: (code: string) => void;
}

const defaultCode: Record<string, string> = {
    java: "// Welcome to CodeNew\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Java\");\n    }\n}",
    python: "# Welcome to CodeNew\ndef main():\n    print(\"Hello Python\")\n\nif __name__ == \"__main__\":\n    main()"
};

export default function EditorWorkspace({ language, onCodeChange }: EditorProps) {
    const [code, setCode] = useState<string>(defaultCode[language] || "");
    
    // 1. STABILITY REF: To prevent infinite loops during synchronization
    const isRemoteUpdate = useRef(false);

    // 2. LANGUAGE SYNC: Update template when language changes
    useEffect(() => {
        const newTemplate = defaultCode[language] || "";
        setCode(newTemplate);
        if (onCodeChange) {
            onCodeChange(newTemplate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    // 3. INCOMING SOCKET UPDATE (Mentor -> Student or vice-versa)
    const handleSocketUpdate = useCallback((incomingCode: string) => {
        if (typeof incomingCode === "string") {
            // Flag this as a remote update so we don't send it back to the socket
            isRemoteUpdate.current = true;
            setCode(incomingCode);
            onCodeChange(incomingCode);
            // Reset flag after render
            setTimeout(() => { isRemoteUpdate.current = false; }, 50);
        }
    }, [onCodeChange]);
    
    const currentTaskId = "demo-task-123";
    const { sendCodeUpdate } = useCodeSync(handleSocketUpdate, currentTaskId);

    // 4. LOCAL CHANGE: User is typing
    const handleEditorChange: OnChange = (value) => {
        const newCode = value ?? "";
        
        // Update local state and parent
        setCode(newCode);
        onCodeChange(newCode);

        // ONLY send to socket if the change came from the keyboard, not the socket itself
        if (!isRemoteUpdate.current) {
            sendCodeUpdate(newCode);
        }
    };

    return (
        <div className="h-full min-h-[500px] w-full overflow-hidden rounded-lg border border-slate-800 bg-[#1e1e1e] shadow-2xl">
            <Editor
                key={language}
                height="100%"
                language={language}
                theme="vs-dark"
                value={code} 
                onChange={handleEditorChange}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    padding: { top: 20 },
                    scrollBeyondLastLine: false,
                    cursorSmoothCaretAnimation: "on",
                    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                    contextmenu: true,
                    formatOnPaste: true,
                    lineNumbers: "on",
                }}
            />
        </div>
    );
}