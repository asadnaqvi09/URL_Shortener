📘 Project Report: URL Shortener with Analytics Dashboard
1. Introduction

The URL Shortener with Analytics Dashboard is a modern web-based application designed to convert long URLs into short, manageable links while providing detailed analytics about user interactions. The system enables users to generate short links instantly and monitor their performance through an intuitive dashboard.

This project focuses on usability, performance, and real-time tracking, making it suitable for individuals, marketers, and businesses who want to manage and analyze link traffic efficiently.

2. Objectives
To develop a system that converts long URLs into short links
To track user interactions such as total clicks and unique clicks
To provide analytics including device type, recent activity, and daily usage
To design a responsive and user-friendly interface
To build a scalable backend using modern technologies
3. Technologies Used
Frontend
EJS
HTML5
Tailwind CSS
JavaScript (Vanilla)

👉 The frontend structure is based on EJS templates, while dynamic interactions and UI rendering are handled using JavaScript.

⚠️ Important Note:
The frontend UI and logic were fully generated and optimized with the help of AI tools, significantly improving development speed and design quality.

Backend
Node.js
Express.js
Database
PostgreSQL

4. System Architecture

The application follows a client-server architecture:

Frontend Layer
User interacts via forms and dashboard
Sends API requests using Fetch API

Backend Layer
Handles routing and business logic
Processes URL shortening and analytics
Database Layer
Stores URLs and click data
Performs aggregation queries for analytics

5. Features

🔗 URL Shortening
Converts long URLs into unique short IDs
Fast and efficient generation

📊 Analytics Dashboard
Total Clicks
Unique Clicks
Last Click Timestamp
Clicks by Device (mobile/desktop)
Daily Click Trends
Recent Click Activity

📋 URL Management
View all created URLs
Delete URLs
Copy short links
Generate QR codes

⚡ Real-Time Interaction
Instant updates without page reload
Dynamic UI rendering using JavaScript

6. Working Mechanism
User enters a long URL
Backend generates a unique short identifier
Data is stored in the database
When a user clicks the short link:
Click data is recorded (IP, device, timestamp)
Analytics API aggregates data and returns insights
Dashboard displays results dynamically

7. Database Design
Tables : 
URLs Table :
id
original_url
short_url
created_at

Clicks Table :
id
url_id (foreign key)
ip_address
device
clicked_at

8. API Endpoints
URL APIs
POST /api/v1/url → Create short URL
GET /api/v1/url → Get all URLs
DELETE /api/v1/url/:short_url → Delete URL
Analytics APIs
GET /api/v1/analytics/:short_url → Get analytics data
9. Challenges Faced
Handling incorrect API requests (e.g., passing full URL instead of short ID)
Managing state in a single-page interface
Designing efficient SQL queries for analytics
Synchronizing frontend and backend data formats
10. Advantages
Fast and efficient URL shortening
Real-time analytics tracking
Clean and responsive UI
Scalable backend architecture
Easy integration with other systems
11. Limitations
No user authentication system
Limited analytics (no geolocation yet)
Basic UI without advanced charts
12. Future Enhancements
User authentication and dashboard per user
Advanced analytics (country, browser, OS)
Graphical charts and visualizations
Custom short URLs
Link expiration and scheduling
Cloud deployment (AWS / Vercel)
13. Conclusion
The URL Shortener with Analytics Dashboard successfully demonstrates how modern web technologies can be used to build a scalable and efficient system. It provides both functionality and insight, combining URL management with real-time analytics.

The use of AI in frontend development significantly accelerated the design process and ensured a high-quality user interface.

This project serves as a strong foundation for building production-level SaaS applications in the future.