CodeNew is a full-stack interactive workspace designed to bridge the gap between mentors and students. It features a live code editor, an integrated execution engine, and a private messaging system powered by WebSockets for real-time guidance.

🚀 Key Features
Live Code Sandbox: Multi-language support (Java & Python) using the Monaco Editor.

Instant Execution: Integrated with the Piston API for real-time code compilation and output.

Real-Time Mentorship: A 1:1 "Private Post Office" chat system using Spring WebSocket & STOMP for low-latency communication.

Secure Access: Role-based access control (Student/Mentor) secured with JWT (JSON Web Tokens) and Spring Security.

Live Workspace: Dedicated session-based environments for debugging and code reviews.

🛠️ Tech Stack
Frontend:

React.js (Next.js App Router)

Tailwind CSS (Styling)

Lucide React (Icons)

Monaco Editor (Code Sandbox)

Backend:

Java 17 / Spring Boot 3.x

Spring Security & JWT

Spring WebSocket (STOMP)

PostgreSQL / MySQL (Database Management)

Maven (Build Tool)

🏗️ Architecture Overview
The system follows a decoupled architecture where the React frontend communicates with the Spring Boot backend via REST APIs for authentication and data, and WebSockets for the live messaging layer.

🚦 Getting Started
Prerequisites
JDK 17 or higher

Node.js 18.x or higher

Database (PostgreSQL or MySQL)
