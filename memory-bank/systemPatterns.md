# System Patterns - AI Math Tutor

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ AuthContext | ChatContext | Custom Hooks            │   │
│  │ (useAuth, useConversations, useFirestore, useAPI)   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│              Firebase SDK (Auth, Firestore, Storage)        │
└──────────────────┬────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
   Firebase Auth  Firestore  Storage
   (Emulator)    (Emulator)  (Emulator)

┌─────────────────────────────────────────────────────────────┐
│              Firebase Cloud Functions (Node.js)             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ POST /api/chat      (Socratic dialogue engine)    │    │
│  │ POST /api/ocr       (Image text extraction) [*]   │    │
│  │ POST /api/problemgen (Generate practice) [*]      │    │
│  └────────────────────────────────────────────────────┘    │
│                 ↓                                            │
│            OpenAI API (GPT-4o-mini)                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Chat completions (Socratic dialogue)              │    │
│  │ Vision API (Image OCR)                            │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

[*] = Deferred to Phase 2+
```

## State Management Pattern

### Context Structure

```
AuthContext
├── user (User | null)
├── loading (boolean)
├── error (string | null)
└── signUp, signIn, signOut, signInWithGoogle

ChatContext (useReducer)
├── messages (Message[])
├── conversationId (string)
├── isLoading (boolean)
├── error (string | null)
└── sendMessage, loadConversation, createNewConversation

Custom Hooks
├── useAuth() → { user, loading, error, logout }
├── useConversations() → { conversations, createConv, deleteConv, loading }
├── useFirestore() → { data, loading, error, create, update, delete, query }
└── useAPI() → { call, loading, error, data }
```

### Message Type Extensibility

```typescript
type Message = {
  id: string;
  role: "user" | "assistant";
  type: "text" | "image" | "audio" | "drawing"; // Extensible
  content: string; // Main content
  metadata?: {
    imageUrl?: string; // For images
    audioUrl?: string; // For voice [future]
    extractedText?: string; // For images after OCR
    canvasData?: string; // For whiteboard [future]
  };
  timestamp: Date;
};
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider
│   └── ChatProvider
│       ├── Routes
│       │   ├── /login → LoginPage
│       │   ├── /signup → SignupPage
│       │   └── /chat/:conversationId → ChatPage (Protected)
│       └── Layouts
│           └── Layout
│               ├── Header
│               │   ├── Logo
│               │   └── ProfileDropdown
│               ├── Sidebar [placeholder for Phase 3]
│               └── ChatContainer
│                   ├── MessageList
│                   │   └── MessageBubble[]
│                   │       └── MathRenderer
│                   ├── InputArea
│                   │   ├── Textarea
│                   │   ├── ImageUpload [Phase 2]
│                   │   ├── WhiteboardButton [placeholder]
│                   │   └── SendButton
│                   └── TypingIndicator
```

### Folder Organization

```
src/
├── components/
│   ├── auth/           # Auth UI components
│   ├── chat/           # Chat interface components
│   ├── layout/         # Layout & page structure
│   ├── shared/         # Reusable components (MathRenderer, etc.)
│   └── whiteboard/     # Whiteboard [placeholder]
├── contexts/           # React Context providers
├── hooks/              # Custom hooks (useAuth, etc.)
├── services/
│   ├── firebase.js     # Firebase SDK initialization
│   ├── auth.js         # Auth functions
│   ├── api.js          # API client
│   └── firestore.js    # Firestore CRUD
├── utils/              # Utilities (formatters, helpers)
├── pages/              # Page components
├── App.jsx
├── main.jsx
└── index.css           # Tailwind directives
```

## Backend Architecture

### Cloud Functions Structure

```
functions/
├── src/
│   ├── api/
│   │   ├── chat.js          # Socratic dialogue endpoint
│   │   ├── ocr.js           # OCR extraction [Phase 2]
│   │   └── problemgen.js    # Problem generation [Phase 5]
│   ├── utils/
│   │   ├── prompts.js       # System prompts
│   │   ├── openai.js        # OpenAI client
│   │   └── validation.js    # Input validation
│   └── index.js             # Exports all functions
└── package.json
```

### API Endpoints (Implemented)

```
POST /api/chat
├── Input: { conversationId, userId, message, authToken }
├── Process: Fetch context → Verify answer → Call OpenAI → Extract tags → Save to Firestore
├── Output: { message: string, messageId: string, answerVerification?: { isAnswerCorrect: boolean } }
└── Status: ✅ Deployed

POST /api/ocr
├── Input: { imageData, authToken }
├── Process: Call Vision API → Extract text
├── Output: { extractedText: string }
└── Status: ✅ Deployed

POST /api/tts
├── Input: { text, voice, speed, authToken }
├── Process: Call OpenAI TTS → Encode base64
├── Output: { audioBase64: string }
└── Status: ✅ Deployed

POST /api/generateProblems
├── Input: { problem, solutions, authToken }
├── Process: Call OpenAI → Generate similar problems
├── Output: { problems: Problem[], usage: UsageData }
└── Status: ✅ Deployed
```

## Data Models

### Firestore Schema

```
users/{uid}
├── email: string
├── displayName: string
├── createdAt: timestamp
└── lastLoginAt: timestamp

conversations/{conversationId}
├── userId: string (owner)
├── title: string (first 50 chars)
├── createdAt: timestamp
├── updatedAt: timestamp
└── messageCount: number

conversations/{conversationId}/messages/{messageId}
├── role: 'user' | 'assistant'
├── content: string
├── type: 'text' | 'image' | 'whiteboard'
├── imageUrl?: string
├── extractedText?: string
├── caption?: string
├── answerVerification?: { isAnswerCorrect: boolean }
└── timestamp: timestamp

ttsUsage/{userId}
├── {YYYY-MM-DD}: {
│   ├── count: number
│   └── timestamp: timestamp
│ }

ocrUsage/{userId}
├── {YYYY-MM-DD}: {
│   ├── count: number
│   └── timestamp: timestamp
│ }

problemGenUsage/{userId}
├── {YYYY-MM-DD}: {
│   ├── count: number
│   └── timestamp: timestamp
│ }
```

## Key Design Decisions

### 1. Context API + Hooks vs Redux

- **Decision:** Context API + custom hooks
- **Rationale:** Simpler for MVP, less boilerplate, easier to understand
- **Trade-off:** Might need Redux if complexity grows significantly

### 2. Firestore Emulator for Local Dev

- **Decision:** Use emulators in dev, production Firebase in staging/prod
- **Rationale:** Free, fast, no hitting production limits during development
- **Trade-off:** Must remember to switch config for different environments

### 3. Message Types Extensible from Start

- **Decision:** Support text, image, audio, drawing types in data model
- **Rationale:** Easier to add features later without schema migration
- **Trade-off:** Slightly more complex filtering in some places

### 4. Store Full History but Send Partial Context

- **Decision:** Save all messages to Firestore, send only last 15 to OpenAI
- **Rationale:** Full history for user reference, but keep API calls efficient
- **Trade-off:** Need to manage context window manually

### 5. Firebase Storage from MVP

- **Decision:** Use Firebase Storage for images immediately, not base64
- **Rationale:** Better scalability, performance, and user experience
- **Trade-off:** Slightly more setup complexity

## Error Handling Strategy

```
User Action
    ↓
Try/Catch
    ├── Validation Error → Show inline message
    ├── Network Error → Show toast + retry button
    ├── Auth Error → Redirect to login
    ├── Rate Limit → Queue request + show message
    └── Unknown Error → Show generic message + log
```

### Error Display

- **Toast Notifications:** Transient errors (network, retry-able)
- **Inline Messages:** Form validation, field-specific
- **Modals:** Critical errors requiring action
- **Redirects:** Auth errors → login page
- **Console Logs:** All errors logged for debugging

## Performance Optimizations

- React.memo for expensive components
- useCallback for event handlers
- Lazy load components with React.lazy + Suspense
- Skeleton screens during loading
- Image compression before upload
- Debounce input handlers
- Batch Firestore writes where possible
