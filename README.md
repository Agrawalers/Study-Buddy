# 📚 Study Buddy AI

An AI-powered study companion that helps students learn smarter with personalized flashcards, quizzes, notes, and study planning.

## ✨ Features

- **🤖 AI-Powered Study Materials**: Generate comprehensive study materials on any topic using AI
- **📝 Smart Flashcards**: Interactive flashcards with flip animations for effective memorization
- **🎯 Adaptive Quizzes**: Multiple-choice quizzes with instant feedback and scoring
- **💡 Step-by-Step Explanations**: Interactive explanations with progress tracking and audio playback
- **🔊 Text-to-Speech**: Listen to explanations with natural voice synthesis
- **📖 Study Tips**: Personalized study strategies and learning recommendations
- **🗓️ Study Planner**: Weekly timetable with AI-powered schedule generation
- **📓 Topic Notes**: Create, edit, view, and organize notes with rich text support
- **📊 Progress Tracking**: Visual analytics with real-time topic completion tracking
- **⏱️ Pomodoro Timer**: Built-in focus timer with customizable work/break intervals (1-120 min focus, 1-60 min break)
- **💬 AI Chat Tutor**: Interactive AI assistant with voice input/output support in 8 languages
- **🎤 Echo AI Voice Assistant**: Dedicated voice-to-voice AI conversation with automatic speech recognition
- **🔐 User Authentication**: Secure login with Supabase authentication and duplicate email detection
- **❤️ Favorites System**: Save and quickly access your favorite topics with visual indicators
- **📄 PDF Export**: Export study materials to PDF format
- **🌍 Multi-language Support**: Voice features support English, Hindi, Spanish, French, German, Portuguese, Japanese, and Chinese

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Auth + Database)
- **AI Models**: 
  - Google Gemini API (Study generation)
  - Groq API with Llama 3.3 70B (Echo AI voice assistant)
- **Voice**: Web Speech API (Recognition & Synthesis)
- **Routing**: React Router v6
- **State Management**: TanStack Query + SessionStorage
- **Animations**: Framer Motion
- **Charts**: Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account
- Google Gemini API key
- Groq API key (free at https://console.groq.com)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Agrawalers/Study-Buddy.git
cd Study-Buddy
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GROQ_API_KEY=your_groq_api_key
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The project includes a `vercel.json` configuration for optimal deployment.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── notes/          # Note-related components
│   └── planner/        # Study planner components
├── pages/              # Route pages
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
└── test/               # Test files

supabase/
├── functions/          # Edge functions
└── migrations/         # Database migrations
```

## 🔑 Key Features Explained

### AI Study Generation
Enter any topic and get instant access to:
- Step-by-step explanations with checkboxes to track completion
- Audio playback for each explanation step
- Custom flashcards with flip animations
- Practice quizzes with session persistence
- Personalized study tips
- Links to YouTube and Khan Academy resources

### Echo AI Voice Assistant
- Voice-to-voice conversation with AI
- Automatic speech recognition in 8 languages
- Natural text-to-speech responses
- Visual echo wave animation during speech
- Stop button to interrupt AI responses
- Conversation history with localStorage fallback
- Powered by Groq's Llama 3.3 70B model for fast responses

### AI Chat Tutor
- Text and voice input support
- Multi-language voice recognition (8 languages)
- Automatic voice responses
- Session-based conversation history
- Language selector for international students

### Study Planner
- Create weekly study schedules
- AI-powered schedule optimization
- Color-coded time blocks
- Drag-and-drop interface

### Progress Tracking
- Real-time topic completion tracking
- Study session history with favorites
- Quiz score analytics
- Visual charts and statistics
- Favorite topics with heart indicators

### Notes System
- Create and edit notes with rich text
- Read-only viewer mode
- Clickable note cards
- Organized by topic

### Pomodoro Timer
- Customizable focus duration (1-120 minutes)
- Customizable break duration (1-60 minutes)
- Visual countdown timer
- Audio notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author
**Kushagra Agrawal**


## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Gemini](https://ai.google.dev/) and [Groq](https://groq.com/)
- Backend by [Supabase](https://supabase.com/)
- Voice features using Web Speech API

---

Made with ❤️ for students everywhere
