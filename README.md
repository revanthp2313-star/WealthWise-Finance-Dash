# WealthWise: Personal Finance Dashboard

WealthWise is a full-stack web application built to help users manage their personal finances. Instead of just tracking expenses, this project integrates the Groq API (using Meta's LLaMA 3.3 model) to analyze spending patterns and provide actionable financial advice in real time.

## Key Features

- **Advanced Analytics**: Calculates your remaining budget, savings rate, average daily spend, and dynamic category breakdowns using Recharts.
- **AI Financial Advisor**: Uses live spending data to generate custom-tailored financial insights.
- **Secure Authentication**: Uses JWT-based stateless authentication and Bcrypt to keep passwords secure.
- **Responsive UI**: A modern interface built with React, featuring CSS modules and dynamic visual indicators.
- **Data Export**: Allows users to download CSV and PDF reports of their transactions.

## Technology Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Recharts (Data Visualization)
- jsPDF & jsPDF-AutoTable
- Vanilla CSS Modules

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & Bcryptjs
- Groq SDK

## Getting Started

### Prerequisites
You will need Node.js and MongoDB installed on your system. You also need an API key from Groq to use the AI features.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/revanthp2313-star/WealthWise-Finance-Dash
   cd wealthwise
   ```

2. **Install Backend Dependencies**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Variables**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GROQ_API_KEY=your_groq_api_key
   ```

5. **Run the Application**
   Run the full-stack application concurrently:
   ```bash
   npm run dev
   ```
   - The backend server will start on `http://localhost:5000`
   - The frontend will be available at `http://localhost:5173`

## How the AI Integration Works

The backend aggregates your monthly spending data—calculating totals, finding your most frequent categories, and analyzing your budget utilization. This structured financial snapshot is then injected into a custom prompt and sent to the Groq API. This ensures the AI's advice is strictly grounded in your actual financial reality.
