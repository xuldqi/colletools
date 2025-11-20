<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ColleTools - Next.js Edition

The ultimate toolkit for college students. Features a GPA Calculator, AI-powered Email Generator, Citation Helper, Deadline Tracker, and Decision Maker to make campus life easier.

## Run Locally

**Prerequisites:** Node.js 18+ 

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and set your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components
- `app/api/email/` - API route for email generation using Gemini AI

## Features

- **Final Grade Calculator** - Calculate what you need on your final exam
- **Email Generator** - AI-powered professional email templates
- **Deadline Tracker** - Track assignments with priority and urgency indicators
- **Citation Helper** - Format APA & MLA citations instantly
- **Study Room** - Pomodoro timer with Lo-Fi music
- **Decision Maker** - Let fate decide for you

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Google Gemini AI
