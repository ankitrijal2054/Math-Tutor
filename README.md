# 🎓 AI Math Tutor - Socratic Learning Assistant

[![Deployed](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)](https://ai-math-tutor-b09db.web.app/)
[![React](https://img.shields.io/badge/React-18%2B-blue?style=flat-square&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosted-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green?style=flat-square&logo=openai)](https://openai.com/)

**Live Demo:** [https://ai-math-tutor-b09db.web.app/](https://ai-math-tutor-b09db.web.app/)

---

## 🌟 Overview

AI Math Tutor is a web-based conversational AI tutoring platform that teaches mathematics through the **Socratic method**. Instead of giving answers, it guides students through step-by-step reasoning using leading questions, hints, and validation—building genuine understanding and critical thinking skills.

### Why Socratic Learning?

- ✅ **Deep Understanding** - Students discover solutions, not memorize answers
- ✅ **24/7 Availability** - Patient, judgment-free tutoring anytime
- ✅ **Adaptive Guidance** - AI adjusts questions based on student responses
- ✅ **Zero Cost** - Unlimited access with no subscriptions or paywalls

---

## ✨ Key Features

### 💬 Core Tutoring

- **Text-based Problem Input** - Type mathematical problems in natural language
- **Socratic Dialogue Engine** - AI guides through thoughtful questioning
- **Conversation Memory** - Full context awareness across exchanges
- **Math Notation Support** - LaTeX rendering for equations and formulas

### 📸 Advanced Input Methods

- **Image Upload with OCR** - Scan handwritten or printed problems
- **Interactive Whiteboard** - Draw diagrams, sketches, and solutions
- **Drawing Tools** - Pen, eraser, shapes (lines, circles, rectangles)
- **Canvas Export** - Convert drawings to images for AI analysis

### 🎤 Voice Interface

- **Speech-to-Text (STT)** - Speak your math problems aloud
- **Text-to-Speech (TTS)** - Listen to AI explanations
- **Mobile-Ready** - Full microphone and speaker support

### 📚 Conversation Management

- **Sidebar History** - View all past conversations organized by date
- **Quick Switching** - Jump between different math topics instantly
- **Full-Text Search** - Find previous conversations easily
- **Delete with Confirmation** - Clean up your conversation history

### 🎨 User Experience

- **Responsive Design** - Seamless experience on desktop, tablet, and mobile
- **Dark-First UI** - Modern, eye-friendly interface with Tailwind CSS
- **Real-time Feedback** - Loading indicators, error messages, success confirmations
- **Smooth Animations** - Professional transitions and micro-interactions

### 🔐 Authentication & Privacy

- **Email/Password Sign-up** - Create your own account
- **Google Sign-In** - Quick OAuth authentication
- **Session Persistence** - Stay logged in between visits

---

## 🚀 Quick Start

### Online (No Installation Required)

Simply visit the live deployment:
👉 [https://ai-math-tutor-b09db.web.app/](https://ai-math-tutor-b09db.web.app/)

1. Sign up with email or Google
2. Type a math problem or upload an image
3. Work through the Socratic questions
4. View your conversation history in the sidebar

### Local Development

#### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Firebase CLI** (for backend deployment)
- **OpenAI API Key** (for AI responses)

#### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ankitrijal2054/Math-Tutor
cd "Math Tutor"

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Install backend dependencies
cd ../functions
npm install

# 4. Set up environment variables
# Create frontend/.env.local
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OCR_API_URL=your_ocr_function_url

# Create functions/.env
OPENAI_API_KEY=your_openai_key
FIREBASE_PROJECT_ID=your_project_id
```

#### Running Locally

```bash
# Terminal 1: Start Firebase emulators (optional)
firebase emulators:start

# Terminal 2: Start frontend dev server
cd frontend
npm run dev
# Opens http://localhost:5173

# Terminal 3: Deploy functions locally or use production
cd functions
firebase deploy --only functions
```

---

## 📂 Project Structure

```
Math Tutor/
├── frontend/                    # React Vite application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── auth/           # Authentication components
│   │   │   ├── chat/           # Chat interface
│   │   │   ├── layout/         # Page layouts
│   │   │   ├── sidebar/        # Conversation sidebar
│   │   │   ├── whiteboard/     # Drawing interface
│   │   │   └── shared/         # Reusable components
│   │   ├── contexts/           # React Context (Auth, Chat, Whiteboard)
│   │   ├── hooks/              # Custom hooks (useVoice, useConversations)
│   │   ├── services/           # Firebase, Auth, API clients
│   │   ├── pages/              # Page components
│   │   └── utils/              # Helpers and utilities
│   ├── index.html
│   └── package.json
├── functions/                   # Firebase Cloud Functions
│   ├── src/
│   │   ├── api/                # API endpoints (chat, ocr)
│   │   └── utils/              # OpenAI client, prompts
│   └── package.json
├── memory-bank/                 # Project documentation
└── firebase.json               # Firebase configuration
```

---

## 🛠 Tech Stack

### Frontend

- **Framework:** React 18+ with Hooks
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API + Custom Hooks
- **Math Rendering:** KaTeX
- **HTTP Client:** Fetch API
- **Icons:** Heroicons

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Firebase Cloud Functions
- **Database:** Firestore (NoSQL)
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **AI:** OpenAI GPT-4o-mini

### Infrastructure

- **Hosting:** Firebase Hosting
- **Deployment:** Google Cloud Run
- **Version Control:** Git

---

## 📊 What's Included

### Phase 1: Foundation MVP ✅

- [x] Project setup (Vite, Tailwind, Firebase)
- [x] Authentication system (Email/Password + Google OAuth)
- [x] Chat UI components
- [x] Socratic backend with OpenAI
- [x] Frontend-backend connection
- [x] Math rendering with KaTeX
- [x] Conversation persistence

### Phase 2: Image Upload & OCR ✅

- [x] Image upload to Firebase Storage
- [x] OCR text extraction via Cloud Vision API
- [x] Image display in conversations
- [x] Error handling and validation

### Phase 3: Conversation History UI ✅

- [x] Sidebar with conversation list
- [x] Date-based grouping (Today, Yesterday, This Week, Older)
- [x] Conversation navigation and switching
- [x] Empty states and loading skeletons
- [x] Search/filter functionality
- [x] Delete with confirmation

### Phase 5: Extended Features ✅

- [x] Interactive Whiteboard with drawing tools
- [x] Canvas export and Firebase upload
- [x] Voice Interface (STT + TTS)
- [x] Voice settings and persistence
- [x] Mobile-optimized experience

---

## 🎯 How It Works

### Student Workflow

```
1. Sign In → Create Account or Google Auth
2. Ask Question → Text, image, draw, or speak
3. Get Guided → AI asks Socratic questions
4. Discover Solution → Through reasoning & hints
5. Review History → Access past conversations
6. Practice More → Continue learning
```

### Socratic Method in Action

**Problem:** "How do I solve 2x + 5 = 13?"

```
You: How do I solve 2x + 5 = 13?

AI: Let's think about this step-by-step. What does the variable 'x'
represent here? What do you think our goal is?

You: We need to find the value of x.

AI: Exactly! To find x, we need to isolate it. Look at the equation
2x + 5 = 13. What operation do you see on the left side?

You: The 2x is being added to 5.

AI: Great observation! To isolate the 2x, what would you do with the 5?

You: Subtract 5 from both sides?

AI: Perfect! Try it out. What do you get?

You: 2x = 8

AI: Wonderful! Now x is multiplied by 2. What's the next step?

You: Divide both sides by 2?

AI: Exactly! What's your final answer?

You: x = 4

AI: 🎉 Excellent work! You've solved it correctly!
```

---

## 🔒 Security & Privacy

- **ID Token Verification** - Backend validates all requests
- **Firestore Security Rules** - Data isolated by user
- **Firebase Storage Rules** - Only authenticated users access their files
- **HTTPS Only** - All communications encrypted
- **No Tracking** - Your conversations are private
- **Open Source Patterns** - Security through transparency

---

## 📈 Performance & Scalability

- **Vite Bundling** - Fast development and production builds
- **Lazy Loading** - Components load on-demand
- **Image Compression** - Automatic optimization before upload
- **Firestore Indexing** - Optimized queries for conversations
- **CDN Distribution** - Firebase Hosting serves globally
- **Cloud Functions Scaling** - Auto-scales with demand

**Bundle Size:** ~1,165 KB (gzip: ~316 KB)

---

## 🚢 Deployment

### Live Environment

The application is **currently deployed** at:
👉 [https://ai-math-tutor-b09db.web.app/](https://ai-math-tutor-b09db.web.app/)

### Deploy Your Own

```bash
# Build frontend
cd frontend
npm run build

# Deploy to Firebase
firebase deploy

# This deploys:
# - Frontend to Firebase Hosting
# - Backend functions to Google Cloud Run
# - Firestore rules and indexes
```

---

## 📱 Browser Compatibility

| Browser       | Status          | Notes              |
| ------------- | --------------- | ------------------ |
| Chrome        | ✅ Full Support | Recommended        |
| Edge          | ✅ Full Support | Chromium-based     |
| Safari        | ✅ Full Support | iOS & macOS        |
| Firefox       | ⚠️ Partial      | STT may be limited |
| Mobile Chrome | ✅ Full Support | Optimized          |
| Mobile Safari | ✅ Full Support | iOS 13+            |

---

## 🤝 Contributing

This is a solo developer project, but contributions and suggestions are welcome!

### To Contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Development Standards

- **Code Style:** ESLint + Prettier configured
- **Component Patterns:** Functional components with Hooks
- **State Management:** React Context API + useReducer
- **Styling:** Tailwind CSS utility-first approach
- **Error Handling:** Try-catch with user-friendly messages
- **Performance:** React.memo, useCallback, lazy loading

---

## 🐛 Known Limitations & Future Work

### Current Limitations

- STT works best in Chrome/Edge (Firefox partial support)
- Drawing recognition is manual (no auto-OCR of whiteboard)
- Single user accounts (no teacher view or analytics)

### Planned Features (Phase 6+)

- [ ] Problem generation for practice
- [ ] Learning analytics and progress tracking
- [ ] Teacher dashboard
- [ ] Handwriting recognition on whiteboard
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Multi-language UI

---

## 📚 Resources

- **OpenAI Docs:** [platform.openai.com/docs](https://platform.openai.com/docs)
- **Firebase Docs:** [firebase.google.com/docs](https://firebase.google.com/docs)
- **React Docs:** [react.dev](https://react.dev)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)
- **KaTeX:** [katex.org](https://katex.org)

---

## 📞 Support & Feedback

Have questions or found an issue?

- 🐛 **Report bugs** - Create an issue on GitHub
- 💡 **Suggest features** - Discussions or email
- 💬 **Ask questions** - Start a discussion

---

## 📄 License

This project is open source. Check LICENSE file for details.

---

## 🙏 Acknowledgments

- **OpenAI** - GPT-4o-mini for intelligent tutoring
- **Firebase** - Backend infrastructure and database
- **React & Vite** - Modern development tools
- **Tailwind CSS** - Beautiful, responsive design
- **KaTeX** - Professional math rendering

---

## 👨‍💻 Author

**Ankit** - Solo Developer

---

<div align="center">

### 🎓 Start Learning Today!

[Visit AI Math Tutor](https://ai-math-tutor-b09db.web.app/) • [Report Issue](ankitrijal2054@gmail.com) • [Feature Request](ankitrijal2054@gmail.com)

Made with ❤️ for students everywhere

</div>
