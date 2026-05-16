# TaskZen: AI Productivity Platform

TaskZen is a modern, AI-powered productivity platform designed to help you manage tasks, take smart notes, and summarize meetings with ease.

## Features

- **AI Task Manager**: Auto-prioritization and subtask generation.
- **AI Notes Assistant**: Convert notes to tasks and summarize content.
- **AI Meeting Summarizer**: Extract action items from transcripts.
- **AI Daily Planner**: Optimize your schedule for maximum focus.

## Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, ShadCN UI, Framer Motion.
- **Backend**: FastAPI (Python), PostgreSQL, Clerk Auth.
- **AI**: Google Gemini API, OpenAI API.

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.12+
- Clerk API Keys
- OpenAI/Gemini API Keys

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TaskZen
   ```

2. Setup the Frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Setup the Backend:
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## License

MIT
