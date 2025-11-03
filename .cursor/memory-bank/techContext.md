# Tech Context - AI Math Tutor

## Technology Stack

### Frontend

- **Framework:** React 18.3+ (Functional components + Hooks)
- **Build Tool:** Vite 7+
- **Styling:** Tailwind CSS v4.1+
- **Routing:** react-router-dom v6+
- **Math Rendering:** KaTeX 0.16+ + react-katex
- **Icons:** lucide-react
- **UI Components:** @headlessui/react
- **Notifications:** react-hot-toast
- **Markdown:** react-markdown

### Backend

- **Runtime:** Node.js 18+
- **Serverless:** Firebase Cloud Functions
- **ODM/ORM:** Firebase Admin SDK

### Database & Storage

- **Database:** Cloud Firestore (NoSQL)
- **File Storage:** Firebase Storage
- **Authentication:** Firebase Authentication
- **Hosting:** Firebase Hosting

### AI & APIs

- **AI Model:** OpenAI GPT-4o-mini
- **Vision:** GPT-4o-mini (OCR via Vision API)

### Development Tools

- **Version Control:** Git
- **CLI:** Firebase CLI
- **Emulators:** Firebase Emulators Suite (Auth, Firestore, Functions)

## Environment Setup

### Development Environment

```
Workspace: /Users/ankit/Desktop/GauntletAI/Math Tutor
Node.js: 18+ (currently using system Node)
npm: 10+
Firebase CLI: Latest
```

### Running Locally

**Terminal 1 - Vite Dev Server:**

```bash
cd frontend
npm run dev
# Running at http://localhost:5173
```

**Terminal 2 - Firebase Emulators:**

```bash
firebase emulators:start
# Auth: 9099
# Firestore: 8080
# Functions: 5001
# UI: 4000
```

**Terminal 3 - Working Terminal:**

```bash
# Run build commands, tests, deployments
```

## Configuration Files

### Frontend Configuration

- `frontend/vite.config.js` - Vite configuration
- `frontend/tailwind.config.js` - Tailwind customization (colors, fonts)
- `frontend/postcss.config.js` - PostCSS + Tailwind
- `frontend/.env.local` - Environment variables (git-ignored)

### Backend Configuration

- `firebase.json` - Firebase services configuration
- `functions/.env` - Cloud Functions env vars (git-ignored)
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore indexes

### Project Configuration

- `.gitignore` - Git ignore rules
- `.git/` - Version control

## Dependencies

### Frontend package.json

```json
{
  "dependencies": {
    "react": "^18.3+",
    "react-dom": "^18.3+",
    "react-router-dom": "^6+",
    "firebase": "^10+",
    "katex": "^0.16+",
    "react-katex": "^3+",
    "react-markdown": "^8+",
    "lucide-react": "^latest",
    "@headlessui/react": "^1.7+",
    "react-hot-toast": "^2.4+",
    "clsx": "^2+"
  },
  "devDependencies": {
    "vite": "^7+",
    "tailwindcss": "^4.1+",
    "@tailwindcss/postcss": "^4.1+",
    "postcss": "^8+",
    "autoprefixer": "^10+"
  }
}
```

### Functions package.json

```json
{
  "dependencies": {
    "firebase-admin": "^12+",
    "firebase-functions": "^6+"
  },
  "engines": {
    "node": "22"
  }
}
```

## Environment Variables

### Frontend (.env.local)

```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_API_BASE_URL=http://localhost:5001/PROJECT_ID/us-central1
```

### Backend (functions/.env)

```
OPENAI_API_KEY=sk-xxx
FIREBASE_PROJECT_ID=xxx
```

## Development Constraints

### Firestore

- **Test Mode:** Currently running (allow all reads/writes for development)
- **Region:** us-south1
- **Emulator:** Running on localhost:8080 in development

### Firebase Auth

- **Providers:** Email/Password + Google OAuth
- **Emulator:** Running on localhost:9099 in development

### Cloud Functions

- **Region:** us-central1
- **Memory:** 256MB (can increase if needed)
- **Timeout:** 60 seconds
- **Emulator:** Running on localhost:5001 in development

### OpenAI

- **Model:** GPT-4o-mini (fast, vision-capable, cost-effective)
- **Temperature:** 0.7 (balance creativity/consistency)
- **Max Tokens:** 500 (keep responses concise)
- **Rate Limits:** Handle with exponential backoff

## Build & Deployment

### Frontend Build

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Deploy to Firebase

```bash
firebase deploy
# Deploys: Hosting + Functions + Firestore Rules
```

### Individual Deployments

```bash
firebase deploy --only hosting      # Frontend only
firebase deploy --only functions    # Cloud Functions only
firebase deploy --only firestore:rules  # Security rules only
```

## Known Issues & Workarounds

### Tailwind v4 PostCSS Setup

- **Issue:** tailwindcss moved PostCSS plugin to @tailwindcss/postcss
- **Workaround:** Install @tailwindcss/postcss and update postcss.config.js
- **Status:** ✅ Fixed in setup

### Firebase Emulator Storage Port

- **Issue:** Storage emulator runs on 9199, not 9090
- **Workaround:** Specify port 9199 in connectStorageEmulator()
- **Status:** ✅ Configured in firebase.js

## Performance Targets

- **Initial Page Load:** < 2 seconds
- **Time to Interactive:** < 3 seconds
- **Chat Message Latency:** < 4 seconds (API call + render)
- **Image Upload:** < 5 seconds
- **Lighthouse Score:** 90+ on all metrics

## Security Considerations

- **API Keys:** All keys in .env files (git-ignored)
- **CORS:** Only allow requests from localhost in dev
- **Firebase Rules:** Implement auth-based access control (added in Phase 3)
- **Images:** Validate file type/size before upload
- **User Data:** Only authenticated users can access their data
