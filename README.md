CodeNew is a full-stack interactive workspace designed to bridge the gap between mentors and students. It features a live code editor, an integrated execution engine, and a private messaging system powered by WebSockets for real-time guidance.

# Key Features
1. Live Code Sandbox: Multi-language support (Java & Python) using the Monaco Editor.
2. Instant Execution: Integrated with the Piston API for real-time code compilation and output.
3. Real-Time Mentorship: A 1:1 "Private Post Office" chat system using Spring WebSocket & STOMP for low-latency communication.
4. Secure Access: Role-based access control (Student/Mentor) secured with JWT (JSON Web Tokens) and Spring Security.
5. Live Workspace: Dedicated session-based environments for debugging and code reviews.

# Tech Stack
 # Frontend:
1. React.js (Next.js App Router)
2. Tailwind CSS (Styling)
3. Lucide React (Icons)
4. Monaco Editor (Code Sandbox)

# Backend:
 1. Java 17 / Spring Boot 3.x
 2. Spring Security & JWT
 3. Spring WebSocket (STOMP)
 4. PostgreSQL / MySQL (Database Management)
 5. Maven (Build Tool)

# Architecture Overview
The system follows a decoupled architecture where the React frontend communicates with the Spring Boot backend via REST APIs for authentication and data, and WebSockets for the live messaging layer.
#  Getting Started
# Prerequisites
1. JDK 17 or higher
2. Node.js 18.x or higher
3. Database (PostgreSQL or MySQL)

# Screen Shots
https://github.com/Dee-1234/codeNew-FullStackProject/tree/main/Screen%20Shots
