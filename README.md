# 📚 Study Buddy AI

An AI-powered study companion that helps students learn smarter with personalized flashcards, quizzes, notes, and study planning.

## ✨ Features

- **🤖 AI-Powered Study Materials**: Generate comprehensive study materials on any topic using Google Gemini AI
- **📝 Smart Flashcards**: Interactive flashcards with flip animations for effective memorization
- **🎯 Adaptive Quizzes**: Multiple-choice quizzes with instant feedback and scoring
- **💡 Detailed Explanations**: In-depth topic explanations with enhanced learning content
- **📖 Study Tips**: Personalized study strategies and learning recommendations
- **🗓️ Study Planner**: Weekly timetable with AI-powered schedule generation
- **📓 Topic Notes**: Create, edit, and organize notes with rich text support
- **📊 Progress Tracking**: Visual analytics of your study history and performance
- **⏱️ Pomodoro Timer**: Built-in focus timer with customizable work/break intervals
- **💬 AI Chat Tutor**: Interactive AI assistant for questions and clarifications
- **🔐 User Authentication**: Secure login with Supabase authentication
- **❤️ Favorites**: Save and quickly access your favorite topics
- **📄 PDF Export**: Export study materials to PDF format

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Auth + Database)
- **AI**: Google Gemini API
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **Animations**: Framer Motion
- **Charts**: Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account
- Google Gemini API key

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
- Comprehensive explanations
- Custom flashcards
- Practice quizzes
- Study tips

### Study Planner
- Create weekly study schedules
- AI-powered schedule optimization
- Color-coded time blocks
- Easy drag-and-drop interface

### Progress Tracking
- Study session history
- Topic frequency analysis
- Visual charts and statistics
- Favorite topics tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Agrawal**
- GitHub: [@Agrawalers](https://github.com/Agrawalers)

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Backend by [Supabase](https://supabase.com/)

---

Made with ❤️ for students everywhere
