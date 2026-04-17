# 🚀 Briefly - High-Performance URL Shortener
**Briefly** is a modern, full-stack URL shortening service built with a focus on speed, real-time analytics, and developer experience. It features a robust backend using **Node.js** and **PostgreSQL**, with **Redis** caching to ensure lightning-fast redirects.
## ✨ Key Features
- **Lightning Fast Redirects:** Integrated **Redis** caching to minimize database lookups.
- **Real-Time Analytics:** Track total clicks, unique visitors, and last activity without page refreshes.
- **Device Detection:** Detailed breakdown of traffic by device type (Mobile, Desktop, Tablet).
- **QR Code Generation:** Instant QR code creation for every shortened link.
- **Secure Architecture:** Custom rate limiting to prevent bot attacks and DDoS on redirect routes.
- **Modern UI:** Clean, minimal, and responsive dashboard built with **Tailwind CSS**.
## 🛠️ Tech Stack
- **Frontend:** Vanilla JavaScript (SPA Architecture), EJS, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL (Relational Data), Redis (Caching Layer).
- **Utilities:** Nanoid (Unique IDs), UA-Parser-JS (Analytics), QRCode.
## 🏗️ System Architecture
Briefly follows a **Separation of Concerns** principle to ensure scalability:
1. **Redirect Engine:** Handles incoming short URLs at the root level (`/`) for maximum brevity.
2. **Analytics API:** Aggregates data from the `clicks` table using optimized SQL joins.
3. **Cache Layer:** Implements a "Cache-Aside" pattern where URLs are stored in Redis for 1 hour after the first hit.
## 🚀 Getting Started
### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Redis Server
### Installation
1. Clone the repository:
   git clone https://github.com/asadnaqvi09/URL_Shortener.git
   cd briefly
2. Install dependencies:
   npm install
3. Create a `.env` file and add your credentials:
   PORT=5000
   DATABASE_URL=postgres://user:password@localhost:5432/url_shortener
   REDIS_URL=redis://localhost:6379
   BASE_URL=http://localhost:5000
4. Run database migrations (Schema provided in `/database` folder).
5. Start the server:
   npm run dev
## 📊 Database Schema
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_url VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  qr_code TEXT
);

CREATE TABLE clicks (
  id SERIAL PRIMARY KEY,
  url_id INTEGER REFERENCES urls(id) ON DELETE CASCADE,
  ip_address VARCHAR(50),
  device VARCHAR(50),
  user_agent TEXT,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
