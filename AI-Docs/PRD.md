# AI Math Tutor - Socratic Learning Assistant

## Overview

The AI Math Tutor is an intelligent, conversational educational web application (responsive for desktop and mobile browsers) that teaches mathematics through Socratic questioning rather than providing direct answers. Students input problems via text or image upload, and the AI guides them through step-by-step reasoning using leading questions, hints, and validation.

**Problem it solves:** Traditional tutoring gives students answers, not understanding. Students need guided practice that builds critical thinking and mathematical intuition.

**Target users:**

- Primary: Middle school through early college students seeking math help
- Secondary: Educators and researchers studying AI-assisted learning

**Platform:** Web application (responsive design for desktop and mobile browsers)

**Value proposition:**

- Promotes deep conceptual understanding through guided discovery
- Provides unlimited, patient tutoring available 24/7
- Adapts questioning based on student responses and comprehension level

**Success criteria:** Successfully guides students through diverse problem types (arithmetic, algebra, geometry, word problems, multi-step problems) without giving direct answers while maintaining conversation context and adapting to understanding level.

---

## Core Features

### 1. Problem Input (Text + Image)

**What it does:** Accepts math problems through text input or image upload (both printed and handwritten).

**Why it's important:** Provides flexibility for different user preferences and problem sources (textbooks, worksheets, photos of homework).

**How it works:**

- Text input: Direct entry through chat interface
- Image upload: User uploads photo → GPT-4o-mini Vision API extracts problem text via OCR → System confirms extracted text with user → Proceeds to dialogue
- Error handling: If OCR fails, user can manually type or correct the extracted text

### 2. Socratic Dialogue Engine

**What it does:** Engages students in multi-turn conversations using guided questions, never providing direct answers.

**Why it's important:** Core pedagogical approach that builds critical thinking and ensures genuine understanding rather than rote memorization.

**How it works:**

- System prompt enforces Socratic rules: "You are a patient math tutor. NEVER give direct answers. Guide through questions. Ask one question at a time. If stuck >2 turns, provide concrete hints. Use encouraging language."
- Conversation flow: Parse problem → Ask what we're solving for → Identify known values → Guide method selection → Step through reasoning → Validate final answer
- Context maintenance: Full conversation stored in Firestore; last 10-15 messages + original problem sent to OpenAI API
- Response validation: AI validates student attempts, provides encouragement, and adjusts difficulty based on responses

### 3. Math Rendering

**What it does:** Displays mathematical equations and expressions in clean, readable formats using proper mathematical notation.

**Why it's important:** Improves comprehension and ensures formulas are presented clearly, not as plain text.

**How it works:**

- Frontend uses KaTeX library to render LaTeX math
- AI outputs math wrapped in delimiters: `$x^2$` for inline, `$$\frac{a}{b}$$` for block equations
- Automatic detection and rendering of delimiters in chat messages
- Fallback: If rendering fails, display raw text

### 4. User Authentication

**What it does:** Enables user login and account creation for personalized experience and conversation persistence.

**Why it's important:** Allows users to maintain conversation history across sessions and devices.

**How it works:**

- Firebase Authentication with two methods:
  - Email/password sign-up and login
  - Google Sign-In (one-click authentication)
- User profile stores: uid, displayName, email, createdAt
- Anonymous access not supported in MVP (authentication required from start)

### 5. Conversation History

**What it does:** Stores and retrieves past tutoring sessions for reference and continued learning.

**Why it's important:** Students can review previous problems, track learning progress, and resume interrupted sessions.

**How it works:**

- Each conversation stored in Firestore with unique ID
- Conversation metadata: title (first problem snippet), creation date, last updated
- Messages stored as subcollection under each conversation
- Sidebar/drawer displays list of past conversations
- Click to load and continue any previous conversation

---

## Stretch Features

### 6. Interactive Whiteboard

**What it does:** Provides a shared drawing canvas for visual problem-solving, diagrams, and geometric proofs in a side-by-side layout with the chat.

**Why it's important:** Many math concepts (geometry, graphing, visual proofs) require drawing and spatial reasoning. Side-by-side layout maintains conversation context while drawing.

**How it works:**

- **Desktop/Tablet browsers (≥768px)**:
  - Collapsed (default): Chat centered, full width
  - Expanded: Chat 30% (left) | Whiteboard 70% (right)
  - Whiteboard slides in from right with smooth animation (300ms)
  - Minimize button to collapse whiteboard back
  - State persists across page refresh (localStorage)
- **Mobile browsers (<768px)**:

  - Collapsed: Chat view only
  - Expanded: Full-screen whiteboard (chat hidden)
  - "Back to Chat" button to return to conversation
  - Slide animation from right
  - State persists across page refresh

- **Tools**: Freehand draw, basic shapes (line, circle, rectangle, triangle), undo/redo, clear, color picker, brush size
- **Library**: react-canvas-draw (lightweight, React-native, touch/stylus support)
- **Workflow**: User opens whiteboard → Draws → Clicks "Share with Tutor" → Canvas converts to PNG → Sent as image message → AI analyzes via Vision API → Responds with guidance
- **Trigger**: User clicks button or AI suggests when detecting visual problem keywords

### 7. Voice Interface

**What it does:** Allows students to speak questions and hear AI responses read aloud.

**Why it's important:** Adds accessibility, engagement, and enables hands-free interaction while working through problems.

**How it works:**

- Speech-to-Text: Web Speech API (browser-native) for voice input
- Text-to-Speech: Web Speech API for MVP (instant playback)
- UI: Microphone button in input bar, visual indicator when recording/processing
- Toggle on/off: User controls when voice mode is active

### 8. Problem Generation

**What it does:** Creates similar practice problems after completing a question to reinforce learning.

**Why it's important:** Repetition with variation builds mastery and confidence.

**How it works:**

- Button appears after problem completion: "Practice Similar Problem"
- Backend calls GPT-4o-mini to generate 2-3 similar questions with varying numbers/context
- Generated problems start new conversation threads
- Future: Track difficulty progression and adapt problem complexity

---

## User Experience

### User Personas

**Persona 1: Alex - 8th Grade Student**

- Struggles with algebra homework
- Prefers typing but sometimes needs to upload worksheet photos
- Wants patient help without judgment
- Uses laptop and mobile browser

**Persona 2: Sam - High School Student**

- Preparing for standardized tests
- Needs explanation of multi-step problems
- Visual learner who benefits from diagrams
- Primarily uses desktop browser

**Persona 3: Dr. Martinez - Education Researcher**

- Evaluates AI tutoring effectiveness
- Observes questioning techniques and student engagement
- Interested in conversation patterns and learning outcomes

### Key User Flows

**Flow 1: First-Time User - Text Problem**

1. User lands on landing page → Sees value proposition
2. Clicks "Get Started" → Sign up with Google or email
3. Redirects to chat interface → Sees welcome message with example problems
4. Types problem: "2x + 5 = 13"
5. AI responds: "What are we trying to find in this equation?"
6. User: "x"
7. AI: "Exactly! To get x alone, what operations do we need to undo?"
8. Conversation continues until solution reached
9. AI: "Great work! Would you like to practice a similar problem?"

**Flow 2: Returning User - Image Upload**

1. User logs in → Sees conversation history sidebar
2. Clicks "New Conversation"
3. Clicks camera icon → Uploads photo of geometry problem
4. Loading indicator: "Analyzing your problem..."
5. AI extracts text → Shows preview: "I see: 'Find the area of a triangle with base 8cm and height 5cm.' Is this correct?"
6. User confirms or edits
7. AI: "What's the formula for the area of a triangle?"
8. Conversation proceeds with Socratic guidance

**Flow 3: Visual Problem with Whiteboard**

1. User enters: "How do I prove these triangles are congruent?"
2. AI: "This is a great problem for drawing! Would you like to open the whiteboard? [Open Whiteboard]"
3. User clicks → Whiteboard slides in from right (chat moves to 30% on desktop, or full-screen switch on mobile)
4. User draws two triangles and labels angles
5. Clicks "Share with Tutor"
6. Canvas image appears in chat (on left side in desktop view)
7. AI: "I can see your triangles. What do you notice about the angles you've labeled?"
8. Dialogue continues with whiteboard still open for reference or additional drawing
9. User clicks minimize → Whiteboard slides out, chat re-centers

### UI/UX Design

#### Design Principles

- **Clean & Minimal:** Focus on conversation, minimal distractions
- **Educational & Warm:** Encouraging tone with friendly colors (indigo/purple gradient)
- **Responsive:** Works beautifully on mobile and desktop
- **Delightful:** Smooth animations, thoughtful micro-interactions
- **Accessible:** WCAG AA compliant contrast, keyboard navigation

#### Main Interface Layout

**Desktop Browser:**

```
Collapsed State (Default):
┌─────────────────────────────────────────────────────┐
│  [🎓 AI Math Tutor]           [Profile ▼] [⚙️]      │
├──────────────┬──────────────────────────────────────┤
│ Conversations│       💬 Chat Messages (Centered)    │
│              │  ┌─────────────────────────────────┐ │
│ [+ New Chat] │  │ [Tutor Avatar] What are we...  │ │
│              │  └─────────────────────────────────┘ │
│ Today        │  ┌─────────────────────────────────┐ │
│ • 2x + 5 =...│  │              x          [You]  │ │
│ • Triangle...│  └─────────────────────────────────┘ │
│              │                                      │
│ Yesterday    │  ┌─────────────────────────────────┐ │
│ • Word prob..│  │ Type your question...           │ │
│              │  │ [📷] [🎨] [🎤]          [Send →]│ │
│              │  └─────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────┘

Expanded State (Whiteboard Open):
┌──────────────────────────────────────────────────────────────────┐
│  [🎓 AI Math Tutor]                    [Profile ▼] [⚙️]           │
├──────┬───────────────┬──────────────────────────────────────────┤
│ Conv │  Chat (30%)   │  🎨 Whiteboard (70%)              [−] [×]│
│      │               │  ┌────────────────────────────────────┐  │
│[+ New│  Messages...  │  │                                    │  │
│      │               │  │        [Canvas Drawing Area]       │  │
│Today │  [Input]      │  │                                    │  │
│• 2x..│               │  └────────────────────────────────────┘  │
│      │               │  🖊️ Draw  ⬜ Shapes ▼  ↩️ Undo  🗑️ Clear│
│      │               │  Color: ⚫ 🔴 🔵 🟢   Size: ●━━━━━      │
│      │               │  [💬 Share with Tutor]                  │
└──────┴───────────────┴──────────────────────────────────────────┘
```

**Mobile Browser:**

```
Chat View (Whiteboard Collapsed):
┌──────────────────────┐
│ [☰] Math Tutor [👤] │
├──────────────────────┤
│                      │
│  [Tutor] Message...  │
│  [You] Message...    │
│                      │
├──────────────────────┤
│ Type here...  [📷]   │
│ [🎨] [🎤]     [Send] │
└──────────────────────┘

Whiteboard View (Full Screen):
┌──────────────────────┐
│ [← Back] Whiteboard │
├──────────────────────┤
│                      │
│   [Canvas Area]      │
│                      │
├──────────────────────┤
│ [🖊️][⬜][↩️][🗑️]     │
│ [Share with Tutor]   │
└──────────────────────┘
```

#### Component Details

**Landing Page:**

- Hero with animated floating math symbols background
- Clear headline: "Learn Math Through Questions, Not Just Answers"
- Two CTA buttons: "Continue with Google" / "Sign In with Email"
- Features preview section
- Demo video or example conversation

**Message Bubbles:**

- Tutor: Left-aligned, soft indigo/purple gradient, with small avatar
- Student: Right-aligned, white with subtle shadow
- Math equations: KaTeX rendered, slightly larger font
- Timestamps: Show on hover
- Animation: Fade + slide up (200ms) on new message

**Input Area:**

- Multi-line textarea that auto-expands (max 5 lines)
- Three icon buttons:
  - 📷 Camera: Opens file picker or drag-drop zone
  - 🎨 Whiteboard: Opens canvas modal (stretch)
  - 🎤 Voice: Activates speech input (stretch)
- Send button: Disabled when empty, enabled with text
- Image preview: Thumbnail with X to remove before sending

**Sidebar/Drawer:**

- "New Conversation" button (prominent, sticky top)
- Conversation list grouped by date (Today, Yesterday, This Week, Older)
- Each item shows: Problem snippet (first 50 chars), timestamp
- Hover: Show delete icon
- Mobile: Hamburger menu to open drawer

**Loading States:**

- Image upload: Progress bar + "Analyzing your problem..." text
- AI thinking: Animated shimmer on placeholder bubble + typing indicator (three dots)
- Initial load: Skeleton screens for conversation list and messages

**Error States:**

- Failed OCR: "Couldn't read the image clearly. Would you like to type the problem instead?"
- API error: "I'm having trouble thinking right now 😅 Let's try that again?" with [Retry] button
- Network error: Toast notification (top-right)
- Validation: Inline feedback (e.g., "Please enter a problem to solve")

**Empty States:**

- No conversations: Friendly illustration + "Start your first problem!"
- Example problems as quick-start buttons
- New conversation: Welcome message with suggested problems

**Whiteboard Modal (Stretch):**

```
Desktop/Tablet (≥768px) - Side Panel:
┌────────────────────────────────────────────────────┐
│  Chat (30%)        │  🎨 Whiteboard (70%)   [−] [×]│
│                    │                                │
│  Messages...       │  ┌──────────────────────────┐ │
│                    │  │   [Canvas Drawing Area]  │ │
│  [Input]           │  └──────────────────────────┘ │
│                    │  🖊️ Draw  ⬜ Shapes  ↩️  🗑️   │
│                    │  Color: ⚫🔴🔵  Size: ●━━━━  │
│                    │  [💬 Share with Tutor]        │
└────────────────────────────────────────────────────┘

Mobile (<768px) - Full Screen:
┌──────────────────┐
│ [← Back] Canvas  │
├──────────────────┤
│                  │
│  [Canvas Area]   │
│                  │
├──────────────────┤
│ [Tools: compact] │
│ [Share Chat]     │
└──────────────────┘
```

#### Color Palette

- Primary: Indigo 600 (#4F46E5) to Purple 500 (#A855F7) gradient
- Secondary: Teal 500 (#14B8A6)
- Background: Gray 50 (light) / Slate 900 (dark)
- Text: Gray 900 (light mode) / Gray 50 (dark mode)
- Success: Green 500 (#10B981)
- Error: Red 500 (#EF4444)

#### Typography

- Headings: Inter (Google Fonts)
- Body: Inter or system fonts
- Math: KaTeX default
- Sizes: Base 16px, generous line-height (1.6)

#### Animations

- Page transitions: 300ms ease-in-out
- Message appear: 200ms fade + slide up
- Button hover: 150ms scale(1.02) + shadow
- Loading shimmer: 1.5s infinite

---

## Technical Architecture

### System Components

**1. Frontend (React + Vite)**

- Framework: React 18+ with JavaScript
- Build tool: Vite (fast dev server, optimized builds)
- State management: React Context API
- Styling: Tailwind CSS
- UI components: Headless UI (accessible primitives)
- Math rendering: KaTeX
- Markdown: react-markdown (for formatting AI responses)
- Icons: lucide-react
- Notifications: react-hot-toast
- Canvas: react-canvas-draw (stretch feature)
- Animations: Framer Motion (optional)

**2. Backend (Firebase Cloud Functions - Node.js 18)**

- Runtime: Node.js 18
- Framework: Firebase Functions
- Endpoints:
  - `POST /api/chat` - Handles Socratic dialogue with OpenAI
  - `POST /api/ocr` - Processes image uploads with Vision API
  - `POST /api/problemgen` - Generates similar practice problems (stretch)
  - `GET /api/conversation/:id` - Retrieves conversation history
  - `DELETE /api/conversation/:id` - Deletes conversation

**3. Database (Firestore)**

- NoSQL document database
- Collections: `users`, `conversations`
- Real-time updates not required (use standard reads/writes)

**4. Authentication (Firebase Auth)**

- Email/password authentication
- Google OAuth
- User session management

**5. Hosting (Firebase Hosting)**

- Static asset hosting for React frontend
- CDN distribution
- HTTPS by default

### Data Models

**User Collection (`users/{uid}`)**

```json
{
  "uid": "string",
  "displayName": "string",
  "email": "string",
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp"
}
```

**Conversation Collection (`conversations/{conversationId}`)**

```json
{
  "conversationId": "string",
  "uid": "string",
  "title": "string (first 50 chars of problem)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "messageCount": "number"
}
```

**Messages Subcollection (`conversations/{conversationId}/messages/{messageId}`)**

```json
{
  "messageId": "string",
  "role": "user | assistant",
  "content": "string",
  "type": "text | image",
  "imageUrl": "string (optional, base64 or storage URL)",
  "timestamp": "timestamp"
}
```

**Context Window Strategy:**

- Store full conversation history in Firestore (all messages)
- When calling OpenAI API: Send original problem (first message) + last 10-15 message pairs
- Token budget: ~2,000-3,000 tokens for context (well within GPT-4o-mini's 128K limit)

### APIs and Integrations

**OpenAI API**

- Model: `gpt-4o-mini` (fast, vision-capable, cost-effective)
- Usage:
  - Chat completions for Socratic dialogue
  - Vision API for image OCR (same model)
  - Problem generation (stretch)
- Rate limiting: Implement exponential backoff on Cloud Functions
- Error handling: Retry logic with user-friendly error messages

**System Prompt Template:**

```
You are a patient, encouraging math tutor using the Socratic method.

RULES:
1. NEVER give direct answers to problems
2. Guide students through reasoning by asking ONE question at a time
3. Start by asking what they're trying to find
4. Help identify known information
5. Suggest methods through questions, not instructions
6. If student is stuck for >2 turns, provide a concrete hint (not the answer)
7. Validate attempts with encouraging language
8. Use LaTeX for math: wrap inline with $...$ and block with $$...$$
9. Keep responses concise and focused

Remember: Your goal is to help them discover the solution themselves.
```

**Firebase Services**

- Cloud Functions: Serverless API endpoints
- Firestore: NoSQL database
- Authentication: User management
- Hosting: Static site deployment
- Environment config: API keys stored securely

### Infrastructure Requirements

**Development Environment:**

- Node.js 18+
- Firebase CLI for local emulators
- Environment variables:
  - `OPENAI_API_KEY`
  - Firebase config (auto-provided)

**Production Environment:**

- Firebase project (Blaze plan for Cloud Functions)
- OpenAI API account with billing enabled
- Custom domain (optional)

**Local Development Stack:**

- Firebase Emulators: Auth, Functions, Firestore
- Vite dev server for frontend
- Environment: `.env.local` for API keys

**Deployment:**

- Frontend: `firebase deploy --only hosting`
- Backend: `firebase deploy --only functions`
- Database rules: `firebase deploy --only firestore:rules`

---

## Development Roadmap

### Phase 1: Foundation MVP

**Goal:** Working text-based AI tutor with authentication

**Scope:**

1. **Project Setup**

   - Initialize React app with Vite + Tailwind CSS
   - Set up Firebase project (Firestore, Auth, Functions, Hosting)
   - Configure Firebase emulators for local development
   - Install dependencies: KaTeX, react-markdown, lucide-react, react-hot-toast, Headless UI

2. **Authentication System**

   - Firebase Auth integration (email/password + Google Sign-In)
   - Login/signup UI components
   - Protected routes (redirect to login if unauthenticated)
   - User profile creation in Firestore on first login
   - Logout functionality

3. **Basic Chat Interface**

   - Chat message component (tutor and user bubbles)
   - Message list container with auto-scroll
   - Text input area with send button
   - Empty state (welcome message)
   - Basic styling with Tailwind (responsive layout)

4. **Backend - Socratic Dialogue Engine**

   - Cloud Function: `POST /api/chat`
   - OpenAI API integration with GPT-4o-mini
   - System prompt implementation (Socratic rules)
   - Request/response handling
   - Error handling and retries
   - CORS configuration

5. **Frontend-Backend Connection**

   - API client utility (fetch wrapper)
   - Loading states (typing indicator)
   - Error handling (toast notifications)
   - Send message → Call API → Display response flow

6. **Math Rendering**

   - Integrate KaTeX library
   - Detect and render `$...$` and `$$...$$` delimiters
   - Apply to all AI responses
   - Fallback to plain text if rendering fails

7. **Conversation Persistence**
   - Firestore conversation and message schemas
   - Save each message to Firestore after sending/receiving
   - Load conversation history on page load
   - Create new conversation with unique ID

**Phase 1 Complete When:**

- User can sign up/login with email or Google
- User can type a math problem and receive Socratic guidance
- Math equations render properly in chat
- Conversation saves to Firestore and persists across page reloads
- Basic responsive UI works on mobile and desktop

---

### Phase 2: Image Upload & OCR

**Goal:** Accept problems via image upload with OCR extraction

**Scope:**

1. **Image Upload UI**

   - Camera icon button in input area
   - File input with image type restriction (jpg, png, heic)
   - Drag-and-drop zone in chat area
   - Image preview before sending
   - Remove/cancel uploaded image
   - Loading indicator during upload/processing

2. **Backend - OCR Processing**

   - Cloud Function: `POST /api/ocr`
   - Accept image upload (base64 or multipart)
   - Send to OpenAI Vision API (GPT-4o-mini with vision)
   - Prompt: "Extract the math problem text from this image. Return only the problem text, no explanations."
   - Return extracted text to frontend
   - Error handling: Unreadable image, no text detected

3. **OCR Confirmation Flow**

   - Display extracted text to user: "I see: '[extracted text]'. Is this correct?"
   - User options: Confirm / Edit / Re-upload
   - If confirmed → Start Socratic dialogue with that problem
   - If edited → Use edited text as problem
   - Store both original image (as message) and extracted text

4. **Image Message Display**
   - Display uploaded images in chat as user messages
   - Thumbnail view with "View Full Size" option
   - Modal for full-size image viewing

**Phase 2 Complete When:**

- User can upload image (printed or handwritten math problem)
- OCR extracts problem text accurately
- User can confirm or edit extracted text
- Image displays in chat history
- AI begins Socratic dialogue based on extracted problem

---

### Phase 3: Conversation History UI

**Goal:** Full conversation management with sidebar and history

**Scope:**

1. **Sidebar/Drawer Component**

   - Desktop: Persistent sidebar (250px width, collapsible)
   - Mobile: Hamburger menu → slide-out drawer
   - "New Conversation" button (prominent, sticky top)
   - Conversation list with grouping (Today, Yesterday, This Week, Older)
   - Each item: Title (problem snippet), timestamp, unread indicator (future)
   - Hover: Delete icon (with confirmation modal)
   - Active conversation highlighted

2. **Conversation Management**

   - Fetch user's conversations from Firestore (ordered by updatedAt desc)
   - Click conversation → Load all messages in main chat
   - Create new conversation → Clear chat, generate new ID
   - Delete conversation → Remove from Firestore, update UI
   - Auto-title: Use first 50 characters of initial problem as title

3. **Navigation & State**

   - React Router for conversation URLs: `/chat/:conversationId`
   - Navigate between conversations without page reload
   - Preserve scroll position in message list
   - Clear input on conversation switch

4. **Empty States & Polish**
   - No conversations yet: Illustration + "Start your first problem!"
   - Example problems as quick-start buttons
   - Loading skeleton for conversation list
   - Smooth transitions between conversations

**Phase 3 Complete When:**

- Sidebar displays all user conversations
- User can click to load any past conversation
- New conversation creates fresh chat
- Delete conversation removes from list and database
- Navigation works smoothly on desktop and mobile browsers

---

### Phase 4: UI/UX Polish & Testing

**Goal:** Professional, delightful user experience

**Scope:**

1. **Visual Polish**

   - Implement full color palette (indigo/purple gradients)
   - Typography refinement (Inter font, proper sizing/spacing)
   - Message bubble styling (avatars, shadows, spacing)
   - Button hover states and active states
   - Smooth animations (Framer Motion or CSS transitions)
   - Dark mode toggle (optional)

2. **Micro-interactions**

   - Message send animation (fade in + slide up)
   - Typing indicator (three animated dots)
   - Button ripple effects
   - Toast notifications with icons
   - Smooth scroll to latest message
   - Input focus states

3. **Error Handling Polish**

   - User-friendly error messages (avoid technical jargon)
   - Retry buttons on failures
   - Inline validation feedback
   - Network status indicator (offline warning)

4. **Accessibility**

   - Keyboard navigation (Tab, Enter, Esc)
   - ARIA labels for icon buttons
   - Focus indicators
   - Color contrast WCAG AA compliance
   - Screen reader support
   - Alt text for images

5. **Mobile Optimization**

   - Touch-friendly button sizes (48px minimum)
   - Optimized image upload from mobile camera
   - Prevent keyboard from breaking layout
   - Responsive text sizing
   - Swipe gestures (optional: swipe to delete conversation)

6. **Testing with Real Problems**

   - Test with 10+ diverse problems:
     - Simple arithmetic: "24 ÷ 6 + 3"
     - Algebra: "Solve for x: 3x - 7 = 14"
     - Geometry: "Find the area of a circle with radius 5cm"
     - Word problem: "If John has 3 apples and buys 5 more..."
     - Multi-step: "Simplify: 2(x + 3) + 4(x - 1)"
   - Validate Socratic approach (no direct answers)
   - Test OCR with printed and handwritten images
   - Cross-browser testing (Chrome, Safari, Firefox)
   - Mobile device testing (iOS, Android)

7. **Performance Optimization**
   - Lazy load conversation list
   - Debounce input (avoid unnecessary re-renders)
   - Optimize image uploads (compress before sending)
   - Memoize expensive components

**Phase 4 Complete When:**

- UI looks polished and professional
- Animations are smooth and delightful
- All interactive elements have proper feedback
- Accessible via keyboard and screen readers
- Tested across browsers and devices
- AI consistently uses Socratic method without giving answers

---

### Phase 5: Stretch Features

**Goal:** Enhanced interactivity and engagement

**Scope:**

**A. Interactive Whiteboard**

1. **Whiteboard UI - Side Panel**
   - Desktop/Tablet (≥768px): Side panel (30% chat / 70% canvas when open)
   - Mobile (<768px): Full-screen switch between chat and canvas views
   - Slides in from right with 300ms animation
   - Minimize/close button collapses panel
   - State persists in localStorage across page refreshes
2. **Canvas Layout States**

   - **Collapsed (default)**: Chat centered, full width, whiteboard hidden
   - **Expanded**:
     - Desktop: Chat shrinks to 30% (left), Canvas 70% (right)
     - Mobile: Full-screen canvas, "Back to Chat" button
   - Smooth transitions between states

3. **Drawing Tools**

   - Toolbar: Freehand draw, shapes (line, circle, rectangle, triangle), undo/redo, clear
   - Color picker (6 preset colors)
   - Brush size selector (small, medium, large)
   - Mobile: Compact horizontal toolbar

4. **Library Integration**

   - Install `react-canvas-draw`
   - Configure canvas component with touch support
   - Export canvas as base64 PNG
   - Send as image message to chat
   - Implement localStorage for panel state persistence

5. **Layout Implementation**

   - CSS Grid or Flexbox for responsive split layout
   - Desktop: Fixed 30/70 split when whiteboard open
   - Mobile: Full-screen overlay with view switching
   - Transition animations (slide in/out from right)
   - Handle window resize gracefully

6. **AI Whiteboard Suggestions**

   - Detect visual problem keywords: "triangle", "graph", "diagram", "draw", "angle"
   - AI offers: "Would you like to open the whiteboard? [Open Whiteboard]"
   - User clicks → Panel slides in (desktop) or switches to canvas view (mobile)

7. **Whiteboard-AI Integration**
   - User shares drawing → Image sent to GPT-4o-mini Vision
   - AI analyzes drawing and continues Socratic questioning
   - Example: "I can see you've drawn a right triangle. What do you know about the relationship between the sides?"

**B. Voice Interface**

1. **Speech-to-Text**

   - Microphone button in input bar
   - Web Speech API integration (`webkitSpeechRecognition` or `SpeechRecognition`)
   - Visual recording indicator (pulsing red mic icon)
   - Transcribed text populates input field
   - User reviews before sending

2. **Text-to-Speech**

   - Speaker icon on each AI message
   - Web Speech API (`speechSynthesis`)
   - Click to read message aloud
   - Pause/resume controls
   - Voice selection (if multiple available)

3. **Continuous Voice Mode (Future)**
   - Toggle for hands-free conversation
   - Auto-send on speech end
   - Auto-play AI responses
   - Visual feedback (sound wave animation)

**C. Problem Generation**

1. **Backend Function**

   - Cloud Function: `POST /api/problemgen`
   - Input: Completed problem text
   - Prompt GPT-4o-mini: "Generate 2-3 similar practice problems with different numbers but same concept. Return as JSON array."
   - Return: `[{problem: "...", hint: "..."}]`

2. **UI Integration**
   - Button appears after problem completion: "Practice Similar Problems"
   - Click → Show generated problems as selectable cards
   - Select one → Start new conversation with that problem

**Phase 5 Complete When:**

- Whiteboard panel works with side-by-side layout on desktop/tablet
- Full-screen canvas switching works on mobile browsers
- Panel state persists across page refreshes
- Slide animations are smooth (300ms)
- Drawing tools function correctly with touch and mouse
- Sharing drawing to chat works seamlessly
- Voice input and output function reliably in supported browsers
- Problem generation creates relevant practice questions
- All stretch features integrate smoothly with core chat

---

## Logical Dependency Chain

### Development Order & Rationale

**Stage 1: Foundation (No Dependencies)**

- **Project setup** → Must be first (all code depends on this)
- **Authentication** → Can build in parallel with chat UI (independent systems)
- Rationale: Get infrastructure working before features

**Stage 2: Core Chat (Depends on Stage 1)**

- **Basic chat UI** → Requires project setup
- **Backend API** → Requires Firebase Functions setup
- **Frontend-backend connection** → Requires both UI and API
- **Math rendering** → Requires chat messages to render in
- Rationale: Establish core interaction loop (input → AI response → display)

**Stage 3: Conversation Persistence (Depends on Stage 2)**

- **Firestore integration** → Requires working chat to have data to save
- **Conversation CRUD** → Requires Firestore schemas
- Rationale: Add persistence only after core functionality works

**Stage 4: Image Upload (Depends on Stage 2)**

- **Image UI** → Requires chat interface to integrate into
- **OCR backend** → Requires working API infrastructure
- **Image message display** → Requires chat message components
- Rationale: Enhancement to input method, not blocking for MVP

**Stage 5: Conversation History UI (Depends on Stage 3)**

- **Sidebar/drawer** → Requires conversation data in Firestore
- **Navigation** → Requires multiple conversations to exist
- Rationale: UI for managing persistence, comes after persistence works

**Stage 6: Polish (Depends on Stages 2-5)**

- **Visual refinement** → Requires all core UI components to exist
- **Testing** → Requires complete feature set
- Rationale: Polish is iterative across all features

**Stage 7: Stretch Features (Depends on Stage 2)**

- **Whiteboard** → Requires chat UI and image message handling
- **Voice** → Requires working chat (independent of other features)
- **Problem generation** → Requires OpenAI integration
- Rationale: Enhancements that can be built independently once core chat works

### Minimum Viable Product (MVP) Boundary

**MVP = Stages 1-4**

- User can sign up, log in
- Type or upload math problems
- Receive Socratic guidance with proper math rendering
- Conversations persist across sessions

**Why this is the MVP:**

- Demonstrates core value proposition (Socratic tutoring)
- Both input methods work (text + image)
- Usable and testable with real students
- Foundation for all other features

**Post-MVP = Stages 5-7**

- Conversation management UI (nice to have, but can use single conversation for demo)
- Polish and refinement
- Stretch features (whiteboard, voice, problem generation)

### Atomic Feature Scoping

Each stage is designed to be:

1. **Independently testable** - Can demo/validate without other features
2. **Incrementally valuable** - Adds user value at each step
3. **Non-blocking** - Failures don't cascade to other features
4. **Buildable in isolation** - Clear inputs/outputs and interfaces

**Example: Image Upload is Atomic**

- Input: User clicks upload, selects file
- Process: File → OCR API → Text extraction
- Output: Extracted text displayed for confirmation
- If OCR fails: Fallback to manual text entry
- Does not break: Chat still works with text input

---

## Risks and Mitigations

### Technical Challenges

**Risk 1: OpenAI API Latency**

- **Impact:** Slow responses (3-5+ seconds) hurt conversational flow
- **Likelihood:** Medium-High
- **Mitigation:**
  - Use GPT-4o-mini (fastest model with vision)
  - Implement streaming responses (future enhancement)
  - Show typing indicator immediately on send
  - Optimize context window (only send necessary messages)
  - Set reasonable timeout (15 seconds)
  - Cache API responses for identical inputs (future)

**Risk 2: OCR Accuracy Issues**

- **Impact:** Misread handwritten or unclear problems frustrate users
- **Likelihood:** High (handwriting varies greatly)
- **Mitigation:**
  - Start testing with printed text (easier for OCR)
  - Always show extracted text for user confirmation
  - Provide "Edit" option before proceeding
  - Fallback: "Couldn't read clearly. Please type the problem or re-upload."
  - Use GPT-4o Vision (better than traditional OCR for math)
  - Guide users: "For best results, use clear handwriting or printed text"

**Risk 3: AI Gives Direct Answers (Breaks Socratic Method)**

- **Impact:** Defeats core pedagogical value
- **Likelihood:** Medium
- **Mitigation:**
  - Strong system prompt with explicit rules and examples
  - Test extensively with edge cases (e.g., "just tell me the answer")
  - Add validation layer: Check response for answer patterns, re-prompt if detected (future)
  - User feedback: "Was this response helpful?" to catch failures
  - Iterate on prompt engineering based on testing
  - Example rule in prompt: "If user asks directly for answer, respond: 'I know you can figure this out! Let's start with...'"

**Risk 4: Math Rendering Failures**

- **Impact:** Equations display as raw LaTeX, confusing students
- **Likelihood:** Low-Medium
- **Mitigation:**
  - Fallback: Display raw text if KaTeX fails
  - Test common LaTeX patterns in development
  - Prompt engineering: "Always use simple LaTeX syntax"
  - Error boundary around math renderer
  - User option: Toggle between rendered and raw text

**Risk 5: Firebase Cost Overruns**

- **Impact:** Unexpected bills from Cloud Functions or Firestore
- **Likelihood:** Low (small scale)
- **Mitigation:**
  - Monitor Firebase usage dashboard weekly
  - Set billing alerts at $25, $50, $100
  - Implement rate limiting per user (max 50 messages/hour)
  - Optimize Firestore reads (batch queries, cache conversation list)
  - Use Cloud Function memory efficiently (256MB minimum)

**Risk 6: Context Window Management**

- **Impact:** AI forgets earlier conversation, loses coherence
- **Likelihood:** Medium (for long conversations)
- **Mitigation:**
  - Send original problem + last 10-15 messages (tested to be sufficient)
  - Store full history in Firestore for user reference
  - If conversation exceeds 30 messages: Suggest starting new conversation with refined problem
  - Future: Implement conversation summarization (every 20 messages, generate summary)

### MVP Definition & Scope Creep

**Risk 7: Feature Creep Delays Launch**

- **Impact:** Spend too much time on polish/stretch features, never ship
- **Likelihood:** High
- **Mitigation:**
  - Clearly define MVP: Stages 1-4 only
  - Time-box each stage (set deadlines)
  - Resist "nice to have" features until MVP works
  - Create placeholder UI for stretch features (e.g., grayed-out whiteboard button with "Coming Soon")
  - Ship MVP, get feedback, then iterate

**Risk 8: Unclear Success Criteria**

- **Impact:** Don't know when feature is "done"
- **Likelihood:** Medium
- **Mitigation:**
  - Define "complete when" criteria for each phase
  - Create test checklist per feature
  - Demo to test users at each stage
  - Acceptance criteria: "User can [specific action] and sees [expected result]"

### Resource Constraints

**Risk 9: OpenAI API Rate Limits**

- **Impact:** API blocks requests during high usage or testing
- **Likelihood:** Low (generous free tier + paid)
- **Mitigation:**
  - Monitor rate limits in OpenAI dashboard
  - Implement exponential backoff on 429 errors
  - Queue requests on frontend (don't spam API)
  - For testing: Use mock API responses in development

**Risk 10: Firebase Free Tier Limits**

- **Impact:** Hit Spark plan limits during development
- **Likelihood:** Medium
- **Mitigation:**
  - Upgrade to Blaze plan early (pay-as-you-go)
  - Use Firebase Emulators for local development (free)
  - Don't store images in Firebase Storage (process and discard)
  - Optimize Firestore queries (use indexes, limit reads)

**Risk 11: Browser Compatibility (Web Speech API)**

- **Impact:** Voice features don't work in all browsers
- **Likelihood:** High (Safari has limited support)
- **Mitigation:**
  - Detect API availability: `if ('webkitSpeechRecognition' in window)`
  - Show "Voice not supported in this browser" message
  - Make voice optional (stretch feature)
  - Fallback: Text input always available
  - Recommend Chrome/Edge for best experience

### User Experience Risks

**Risk 12: Poor Mobile Browser Experience**

- **Impact:** Users abandon on mobile browsers (primary access for many students)
- **Likelihood:** Medium
- **Mitigation:**
  - Responsive design approach with mobile browser breakpoints
  - Test on real mobile devices (iOS Safari, Android Chrome)
  - Optimize input keyboard handling
  - Large touch targets (48px)
  - Responsive layout with Tailwind breakpoints
  - Test image upload from phone camera in browser

**Risk 13: Confusing OCR Confirmation Flow**

- **Impact:** Users don't understand how to correct extracted text
- **Likelihood:** Medium
- **Mitigation:**
  - Clear UI: "I read: '[text]'. Is this correct?"
  - Three obvious buttons: ✓ Yes | ✏️ Edit | 🔄 Re-upload
  - Inline editing (not new modal)
  - Show original image thumbnail next to extracted text
  - User testing on this specific flow

---

## Appendix

### System Prompt - Full Template

```
You are an encouraging, patient math tutor who uses the Socratic method to guide students to discover solutions themselves.

CRITICAL RULES:
1. NEVER provide direct answers to the problem
2. NEVER show complete solution steps
3. ALWAYS ask ONE guiding question at a time
4. ALWAYS validate student attempts with encouragement before next question

TEACHING APPROACH:
- Start by asking: "What are we trying to find?" or "What information do we have?"
- Guide them to identify: knowns, unknowns, relevant formulas/concepts
- If they're stuck after 2 attempts, provide a concrete hint (NOT the answer)
  Example: Instead of "x = 4", say "What happens if we subtract 5 from both sides?"
- Celebrate small wins: "Exactly!", "Great thinking!", "You're on the right track!"
- Adapt difficulty: If they answer quickly, ask deeper "why" questions

RESPONSE FORMAT:
- Keep responses SHORT (2-3 sentences max per turn)
- Use LaTeX for math: Inline $x + 5$, Block $\frac{a}{b}$
- Ask ONE question at a time, don't overwhelm
- Use natural, conversational language

EXAMPLE DIALOGUE:
Student: "2x + 5 = 13"
You: "What are we solving for in this equation?"
Student: "x"
You: "Perfect! To isolate x, what operations do we need to undo?"
Student: "the +5"
You: "Exactly! How do we undo adding 5?"
Student: "subtract 5"
You: "Yes! So what do we get when we subtract 5 from both sides?"

WHAT NOT TO DO:
❌ "First, subtract 5 from both sides to get 2x = 8, then divide by 2 to get x = 4"
❌ "The answer is x = 4"
❌ "Here are the steps: 1) Subtract 5, 2) Divide by 2, 3) x = 4"
✅ "What's the first step to get x by itself?"

Remember: Your goal is to build their confidence and understanding, not just get the right answer.
```

### Technical Specifications

**OpenAI API Configuration:**

```javascript
{
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: SOCRATIC_SYSTEM_PROMPT },
    { role: "user", content: "Problem: 2x + 5 = 13" },
    { role: "assistant", content: "What are we trying to find?" },
    { role: "user", content: "x" },
    ...lastNMessages
  ],
  temperature: 0.7, // Balance creativity and consistency
  max_tokens: 500, // Keep responses concise
  presence_penalty: 0.3, // Reduce repetition
  frequency_penalty: 0.3
}
```

**Vision API for OCR:**

```javascript
{
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Extract the math problem from this image. Return ONLY the problem text with no explanations. Use LaTeX for equations if needed."
        },
        {
          type: "image_url",
          image_url: {
            url: "data:image/jpeg;base64,..." // or https:// URL
          }
        }
      ]
    }
  ],
  max_tokens: 300
}
```

**Firestore Security Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Conversations: users can only access their own
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null &&
        resource.data.uid == request.auth.uid;

      // Messages subcollection
      match /messages/{messageId} {
        allow read, write: if request.auth != null &&
          get(/databases/$(database)/documents/conversations/$(conversationId)).data.uid == request.auth.uid;
      }
    }
  }
}
```

**Cloud Function Structure:**

```javascript
// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { OpenAI } = require("openai");

admin.initializeApp();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Chat endpoint
exports.chat = functions.https.onRequest(async (req, res) => {
  // CORS handling
  res.set("Access-Control-Allow-Origin", "*");

  // Verify auth token
  const token = req.headers.authorization?.split("Bearer ")[1];
  const decodedToken = await admin.auth().verifyIdToken(token);

  // Get conversation context from Firestore
  const conversationRef = admin
    .firestore()
    .collection("conversations")
    .doc(req.body.conversationId);
  const messages = await conversationRef
    .collection("messages")
    .orderBy("timestamp", "desc")
    .limit(15)
    .get();

  // Build OpenAI messages array
  const contextMessages = messages.docs.reverse().map((doc) => ({
    role: doc.data().role,
    content: doc.data().content,
  }));

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SOCRATIC_PROMPT },
      ...contextMessages,
      { role: "user", content: req.body.message },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const response = completion.choices[0].message.content;

  // Save to Firestore
  await conversationRef.collection("messages").add({
    role: "assistant",
    content: response,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.json({ message: response });
});

// OCR endpoint
exports.ocr = functions.https.onRequest(async (req, res) => {
  // Similar structure with Vision API
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract math problem from image..." },
          { type: "image_url", image_url: { url: req.body.imageData } },
        ],
      },
    ],
  });

  res.json({ extractedText: completion.choices[0].message.content });
});
```

### Folder Structure

```
math-tutor/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   └── GoogleSignIn.jsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatContainer.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   ├── InputArea.jsx
│   │   │   │   ├── TypingIndicator.jsx
│   │   │   │   └── ImageUpload.jsx
│   │   │   ├── sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   └── ConversationItem.jsx
│   │   │   ├── whiteboard/
│   │   │   │   ├── WhiteboardPanel.jsx    ← Side panel container
│   │   │   │   ├── Canvas.jsx              ← react-canvas-draw wrapper
│   │   │   │   ├── Toolbar.jsx
│   │   │   │   └── MobileCanvasView.jsx   ← Full-screen mobile view
│   │   │   ├── shared/
│   │   │   │   ├── MathRenderer.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   └── layout/
│   │   │       ├── Header.jsx
│   │   │       └── Layout.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── firebase.js
│   │   │   └── openai.js
│   │   ├── utils/
│   │   │   ├── formatMessage.js
│   │   │   ├── mathParser.js
│   │   │   └── helpers.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useChat.js
│   │   │   └── useConversations.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── functions/
│   ├── src/
│   │   ├── api/
│   │   │   ├── chat.js
│   │   │   ├── ocr.js
│   │   │   └── problemGen.js
│   │   ├── utils/
│   │   │   ├── prompts.js
│   │   │   ├── openai.js
│   │   │   └── validation.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── firestore.rules
├── firebase.json
└── README.md
```

### Testing Checklist

**Authentication:**

- [ ] Email/password signup creates user in Firestore
- [ ] Email/password login redirects to chat
- [ ] Google Sign-In works and creates user
- [ ] Logout clears session
- [ ] Protected routes redirect to login when not authenticated
- [ ] User profile displays correctly

**Chat Functionality:**

- [ ] Type message and send → AI responds with Socratic question
- [ ] Math equations render properly (inline and block)
- [ ] Typing indicator shows while waiting for response
- [ ] Messages save to Firestore
- [ ] Conversation persists after page reload
- [ ] Error handling: Network failure shows retry button
- [ ] Long messages wrap properly in bubbles

**Image Upload & OCR:**

- [ ] Click camera icon → File picker opens
- [ ] Upload printed math problem → Text extracted correctly
- [ ] Upload handwritten problem → Text extracted (may need correction)
- [ ] Confirmation flow: User can edit extracted text
- [ ] Image displays in chat as user message
- [ ] OCR failure → Fallback message with retry option

**Conversation Management:**

- [ ] Sidebar displays list of conversations
- [ ] Click conversation → Loads messages correctly
- [ ] New conversation button → Creates fresh chat
- [ ] Delete conversation → Removes from list and Firestore
- [ ] Conversation titles auto-generate from first message
- [ ] Mobile: Drawer opens/closes smoothly

**Socratic Tutoring (Core Validation):**

- [ ] AI asks guiding questions, not direct answers
- [ ] AI validates student responses with encouragement
- [ ] AI provides hints when student stuck (not answers)
- [ ] AI asks one question at a time
- [ ] AI adapts to student responses
- [ ] Test with: "Just tell me the answer" → AI refuses politely

**Test Problems:**

1. Simple arithmetic: "48 ÷ 6"
2. Basic algebra: "Solve: 2x + 5 = 13"
3. Word problem: "John has 3 apples and buys 5 more. How many total?"
4. Geometry: "Find area of circle with radius 7cm"
5. Multi-step: "Simplify: 2(x + 3) + 4(x - 1)"
6. Fractions: "1/2 + 1/3 = ?"
7. Quadratic: "Solve: x² - 5x + 6 = 0"
8. Percentage: "What is 15% of 80?"
9. Pythagorean: "Find hypotenuse of right triangle with sides 3 and 4"
10. System of equations: "x + y = 10, x - y = 2"

**Stretch Features:**

- [ ] Whiteboard panel opens and collapses smoothly
- [ ] Desktop: 30/70 split layout works correctly
- [ ] Mobile: Full-screen canvas view with back button
- [ ] Panel state persists after page refresh (localStorage)
- [ ] Drawing tools work (pen, shapes, colors)
- [ ] Share drawing → Sends to chat as image
- [ ] AI analyzes drawing and responds
- [ ] Voice input → Transcribes correctly
- [ ] Voice output → Reads messages aloud
- [ ] Problem generation → Creates similar problems

**Cross-Browser:**

- [ ] Chrome (desktop & mobile browser)
- [ ] Safari (desktop & mobile browser)
- [ ] Firefox (desktop & mobile browser)
- [ ] Edge (desktop)

**Accessibility:**

- [ ] Tab navigation works through interface
- [ ] Enter key sends message
- [ ] Escape closes modals
- [ ] Screen reader announces messages
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible

### Environment Variables

**Frontend (.env.local):**

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend (Firebase Functions config):**

```bash
firebase functions:config:set openai.key="sk-..."
```

### Performance Benchmarks

**Target Metrics:**

- Initial page load: < 2 seconds
- Message send to AI response: < 4 seconds (GPT-4o-mini)
- Image upload to OCR result: < 5 seconds
- Conversation load: < 1 second
- First Contentful Paint: < 1.5 seconds
- Time to Interactive: < 3 seconds

**Monitoring:**

- Firebase Performance Monitoring
- Lighthouse scores (aim for 90+ on all metrics)
- OpenAI API latency tracking
- Error rate monitoring (< 1% API failures)

### Deployment Checklist

**Pre-Deployment:**

- [ ] All tests passing
- [ ] Environment variables configured in production
- [ ] Firebase Blaze plan activated
- [ ] OpenAI API billing enabled
- [ ] Firestore security rules deployed
- [ ] Firebase Storage rules deployed (if using)
- [ ] Error tracking configured (Sentry or Firebase Crashlytics)
- [ ] Analytics configured (Firebase Analytics)

**Deployment Commands:**

```bash
# Build frontend
cd frontend
npm run build

# Deploy everything
firebase deploy

# Or deploy individually
firebase deploy --only hosting  # Frontend
firebase deploy --only functions # Backend
firebase deploy --only firestore:rules # Database rules
```

**Post-Deployment:**

- [ ] Test in production environment
- [ ] Verify API endpoints working
- [ ] Check Firebase quotas and usage
- [ ] Monitor error logs
- [ ] Test authentication flows
- [ ] Verify all environment variables loaded

### Support Resources

**Documentation:**

- OpenAI API: https://platform.openai.com/docs
- Firebase: https://firebase.google.com/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- KaTeX: https://katex.org/docs/api.html
- Vite: https://vitejs.dev/guide

---

## Summary

This PRD defines a comprehensive AI Math Tutor web application that uses Socratic questioning to teach mathematics effectively. The platform is designed as a responsive web app accessible through desktop and mobile browsers. The MVP focuses on core chat functionality with text and image input, while stretch features add whiteboard, voice, and problem generation capabilities.

**Key Technical Decisions:**

- Frontend: React + Vite + Tailwind CSS
- Backend: Firebase Cloud Functions (Node.js)
- Database: Firestore
- AI: OpenAI GPT-4o-mini (chat + vision)
- Math: KaTeX rendering

**Development Approach:**

- Build foundation first (auth + basic chat)
- Add image upload capability
- Polish UI/UX iteratively
- Implement stretch features independently

**Success Metrics:**

- Successfully guides students through diverse problem types
- Maintains Socratic method (no direct answers)
- Fast response times (< 4 seconds)
- Intuitive, delightful user experience
- Scales reliably with Firebase infrastructure
