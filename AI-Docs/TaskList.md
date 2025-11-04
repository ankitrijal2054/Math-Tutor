## Getting Started

**To begin development:**

1. Start with **Phase 1, Task 1.1** (Project Setup)
2. Complete each task in order
3. Check off subtasks as you finish them
4. Test thoroughly before moving to next task
5. Don't skip dependency tasks
6. Refer to PRD for detailed specifications

**For AI-assisted development:**

- Provide this task list to AI with specific task number
- AI will have context of dependencies and requirements
- Reference PRD sections as needed
- Ask AI to break down subtasks further if needed

**Questions or Issues?**

- Refer to PRD for detailed specifications
- Check EXAMPLES.md for implementation patterns
- Review PROMPTS.md for AI configuration
- See README for setup and troubleshooting

---

_Task list generated from PRD dated November 3, 2025_
_Last updated: November 3, 2025_# AI Math Tutor - Development Task List

## Task Organization

Tasks are organized by phase following the logical dependency chain. Each task includes subtasks in order of completion. Check off subtasks as you complete them.

---

## Phase 1: Foundation MVP

### Task 1.1: Project Setup & Configuration

**Goal:** Initialize development environment and install all dependencies
**Dependencies:** None (Foundation)
**Estimated Effort:** 2-3 hours

**Subtasks:**

- [ ] 1.1.1 Initialize React app with Vite
  - Run `npm create vite@latest frontend -- --template react`
  - Navigate to project directory
  - Test dev server runs successfully
- [ ] 1.1.2 Install and configure Tailwind CSS
  - Install: `npm install -D tailwindcss postcss autoprefixer`
  - Initialize: `npx tailwindcss init -p`
  - Configure `tailwind.config.js` with content paths
  - Add Tailwind directives to `src/index.css`
  - Test: Add a Tailwind class and verify it works
- [ ] 1.1.3 Install core dependencies
  - React Router: `npm install react-router-dom`
  - KaTeX: `npm install katex react-katex`
  - Markdown: `npm install react-markdown`
  - Icons: `npm install lucide-react`
  - Notifications: `npm install react-hot-toast`
  - Headless UI: `npm install @headlessui/react`
- [ ] 1.1.4 Set up Firebase project
  - Go to Firebase Console (console.firebase.google.com)
  - Create new project: "ai-math-tutor"
  - Enable Firestore Database (start in test mode)
  - Enable Authentication (Email/Password + Google)
  - Enable Hosting
  - Copy Firebase config object
- [ ] 1.1.5 Install Firebase SDKs
  - Install: `npm install firebase`
  - Create `src/services/firebase.js`
  - Paste Firebase config and initialize app
  - Export `auth`, `db` (Firestore), and `app` instances
- [ ] 1.1.6 Set up Firebase Functions
  - Install Firebase CLI globally: `npm install -g firebase-tools`
  - Login: `firebase login`
  - Initialize Functions: `firebase init functions`
  - Select JavaScript, Node.js 18
  - Navigate to `functions/` directory
  - Install OpenAI SDK: `npm install openai`
- [ ] 1.1.7 Configure environment variables
  - Frontend: Create `.env.local` with Firebase config
  - Backend: Set OpenAI API key: `firebase functions:config:set openai.key="sk-..."`
  - Add `.env.local` to `.gitignore`
- [ ] 1.1.8 Set up Firebase Emulators for local development
  - Initialize emulators: `firebase init emulators`
  - Select: Authentication, Firestore, Functions
  - Configure ports (Auth: 9099, Firestore: 8080, Functions: 5001)
  - Test: `firebase emulators:start`
- [ ] 1.1.9 Create basic folder structure
  ```
  frontend/src/
    ├── components/
    ├── contexts/
    ├── services/
    ├── hooks/
    ├── utils/
    └── App.jsx
  ```
- [ ] 1.1.10 Set up Git repository
  - Initialize: `git init`
  - Create `.gitignore` (node_modules, .env, build)
  - Initial commit: "Initial project setup"

**Acceptance Criteria:**

- ✅ Vite dev server runs without errors
- ✅ Tailwind CSS classes render correctly
- ✅ Firebase project created and configured
- ✅ Firebase emulators run successfully
- ✅ All dependencies installed
- ✅ Project structure organized

---

### Task 1.2: Firebase Authentication System

**Goal:** Implement user signup, login, and session management
**Dependencies:** Task 1.1 (Project Setup)
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 1.2.1 Create AuthContext
  - Create `src/contexts/AuthContext.jsx`
  - Set up React Context with createContext
  - Create AuthProvider component with useState for user state
  - Implement useEffect with `onAuthStateChanged` listener
  - Export useAuth custom hook
  - Wrap App with AuthProvider in `main.jsx`
- [ ] 1.2.2 Create authentication service utilities
  - Create `src/services/auth.js`
  - Implement `signUpWithEmail(email, password)` function
  - Implement `signInWithEmail(email, password)` function
  - Implement `signInWithGoogle()` using GoogleAuthProvider
  - Implement `signOut()` function
  - Implement `createUserProfile(uid, data)` to save to Firestore
  - Export all auth functions
- [ ] 1.2.3 Build SignupForm component
  - Create `src/components/auth/SignupForm.jsx`
  - Add form with email, password, confirm password, display name fields
  - Implement form validation (email format, password match, min length)
  - Add loading state during signup
  - Call `signUpWithEmail` and `createUserProfile` on submit
  - Show error messages with react-hot-toast
  - Redirect to chat on success
- [ ] 1.2.4 Build LoginForm component
  - Create `src/components/auth/LoginForm.jsx`
  - Add form with email and password fields
  - Implement form validation
  - Add loading state during login
  - Call `signInWithEmail` on submit
  - Show error messages with toast
  - Add "Forgot Password?" link (placeholder for now)
  - Redirect to chat on success
- [ ] 1.2.5 Build GoogleSignIn component
  - Create `src/components/auth/GoogleSignIn.jsx`
  - Add "Continue with Google" button with Google icon
  - Call `signInWithGoogle` on click
  - Handle loading state
  - Check if new user, create Firestore profile if needed
  - Show error messages
  - Redirect to chat on success
- [ ] 1.2.6 Create authentication pages
  - Create `src/pages/LoginPage.jsx`
  - Include LoginForm and GoogleSignIn components
  - Add link to signup page
  - Create `src/pages/SignupPage.jsx`
  - Include SignupForm and GoogleSignIn components
  - Add link to login page
  - Style with Tailwind (centered card layout)
- [ ] 1.2.7 Set up protected routes
  - Create `src/components/ProtectedRoute.jsx`
  - Check if user is authenticated using useAuth
  - Redirect to /login if not authenticated
  - Render children if authenticated
  - Add loading state while checking auth
- [ ] 1.2.8 Configure React Router
  - Set up BrowserRouter in `src/main.jsx` or `App.jsx`
  - Define routes:
    - `/login` → LoginPage
    - `/signup` → SignupPage
    - `/chat` → ChatPage (protected)
    - `/chat/:conversationId` → ChatPage (protected)
    - `/` → Redirect to /chat
  - Wrap protected routes with ProtectedRoute component
- [ ] 1.2.9 Create Firestore user profile on signup
  - In auth service, after successful signup
  - Create document in `users/{uid}` collection
  - Fields: `uid`, `email`, `displayName`, `createdAt`, `lastLoginAt`
  - Handle errors gracefully
- [ ] 1.2.10 Test authentication flow
  - Test email/password signup with valid data
  - Test signup validation (weak password, email format)
  - Test email/password login
  - Test Google Sign-In
  - Test logout functionality
  - Test protected route redirection
  - Verify user profile created in Firestore

**Acceptance Criteria:**

- ✅ Users can sign up with email/password
- ✅ Users can log in with email/password
- ✅ Users can sign in with Google
- ✅ User profile saved to Firestore on signup
- ✅ Protected routes redirect to login when not authenticated
- ✅ Auth state persists on page refresh
- ✅ Logout works correctly

---

### Task 1.3: Basic Chat Interface (Frontend UI)

**Goal:** Build chat UI components without backend integration
**Dependencies:** Task 1.1 (Project Setup)
**Estimated Effort:** 5-6 hours

**Subtasks:**

- [ ] 1.3.1 Create MessageBubble component
  - Create `src/components/chat/MessageBubble.jsx`
  - Accept props: `role` (user/assistant), `content`, `timestamp`
  - Style tutor messages: left-aligned, indigo gradient background
  - Style user messages: right-aligned, white background with shadow
  - Add small tutor avatar icon (lucide-react icon)
  - Display timestamp on hover
  - Add fade-in animation (200ms)
- [ ] 1.3.2 Create MessageList component
  - Create `src/components/chat/MessageList.jsx`
  - Accept props: `messages` array
  - Map over messages and render MessageBubble for each
  - Implement auto-scroll to bottom on new message (useEffect + ref)
  - Add scroll container with overflow-y-auto
  - Show empty state: "Start by asking a math question!"
  - Add loading skeleton for initial load
- [ ] 1.3.3 Create InputArea component
  - Create `src/components/chat/InputArea.jsx`
  - Build textarea that auto-expands (max 5 lines)
  - Add Send button (disabled when empty)
  - Add icon buttons: Camera 📷, Whiteboard 🎨, Voice 🎤 (disabled for now)
  - Handle Enter key to send (Shift+Enter for new line)
  - Clear input after send
  - Accept props: `onSend`, `disabled` (loading state)
- [ ] 1.3.4 Create TypingIndicator component
  - Create `src/components/chat/TypingIndicator.jsx`
  - Show animated three dots "..." in tutor message bubble style
  - Use CSS animation for pulsing effect
  - Display while waiting for AI response
- [ ] 1.3.5 Create ChatContainer component
  - Create `src/components/chat/ChatContainer.jsx`
  - Combine MessageList and InputArea
  - Manage local state: `messages`, `input`, `isLoading`
  - Implement `handleSend` function (placeholder, add to messages array)
  - Pass messages to MessageList
  - Pass onSend and disabled to InputArea
  - Show TypingIndicator when isLoading is true
- [ ] 1.3.6 Create Header component
  - Create `src/components/layout/Header.jsx`
  - Show app logo/title: "🎓 AI Math Tutor"
  - Add user profile dropdown (use Headless UI Menu)
  - Dropdown items: Profile (placeholder), Logout
  - Implement logout functionality
  - Responsive: hamburger menu on mobile for sidebar toggle
- [ ] 1.3.7 Create Layout component
  - Create `src/components/layout/Layout.jsx`
  - Structure: Header + Main content area
  - Main content: Grid with Sidebar + Chat + (Whiteboard placeholder)
  - Responsive layout with Tailwind breakpoints
  - Accept children prop for page content
- [ ] 1.3.8 Create ChatPage
  - Create `src/pages/ChatPage.jsx`
  - Wrap ChatContainer in Layout
  - Add placeholder sidebar (empty for now)
  - Style with centered chat when sidebar collapsed
  - Test responsive behavior
- [ ] 1.3.9 Style components with Tailwind
  - Apply color palette: indigo/purple gradients, gray backgrounds
  - Ensure proper spacing and padding
  - Add hover states to buttons
  - Implement smooth transitions
  - Test dark backgrounds for message bubbles
- [ ] 1.3.10 Test chat UI interactions
  - Type message and click send → Message appears in list
  - Press Enter → Message sends
  - Auto-scroll works when messages overflow
  - Empty state displays when no messages
  - Typing indicator appears when loading
  - UI is responsive on mobile and desktop browsers

**Acceptance Criteria:**

- ✅ Chat interface renders with message bubbles
- ✅ Messages display correctly (user vs tutor styling)
- ✅ Input area accepts text and sends on Enter/click
- ✅ Auto-scroll works on new messages
- ✅ Typing indicator shows during loading
- ✅ UI is responsive and polished
- ✅ All components use proper Tailwind styling

---

### Task 1.4: Backend - Socratic Dialogue Engine

**Goal:** Create Cloud Function for AI chat with OpenAI integration
**Dependencies:** Task 1.1 (Project Setup)
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 1.4.1 Create system prompt template
  - Create `functions/src/utils/prompts.js`
  - Define SOCRATIC_SYSTEM_PROMPT constant
  - Include all Socratic rules: never give answers, ask one question at a time, etc.
  - Add LaTeX formatting instructions: `$...$` for inline, `$$...$$` for block
  - Export prompt
- [ ] 1.4.2 Create OpenAI client utility
  - Create `functions/src/utils/openai.js`
  - Import OpenAI SDK
  - Initialize client with API key from config
  - Create `callChatCompletion(messages, options)` function
  - Set default options: model=gpt-4o-mini, temperature=0.7, max_tokens=500
  - Implement error handling and retries (exponential backoff)
  - Export function
- [ ] 1.4.3 Create chat endpoint function
  - Create `functions/src/api/chat.js`
  - Export `chat` Cloud Function (onRequest)
  - Set up CORS headers (allow all origins for MVP)
  - Extract request body: `conversationId`, `message`, `userId`
- [ ] 1.4.4 Implement authentication verification
  - In chat function, extract Authorization header
  - Verify Firebase ID token: `admin.auth().verifyIdToken(token)`
  - Return 401 error if invalid
  - Extract uid from decoded token
  - Verify uid matches request userId
- [ ] 1.4.5 Fetch conversation context from Firestore
  - Get conversation document: `conversations/{conversationId}`
  - Get messages subcollection ordered by timestamp desc, limit 15
  - Reverse array to chronological order
  - Map to OpenAI format: `{role: 'user'/'assistant', content: '...'}`
  - Include original problem (first message) if available
- [ ] 1.4.6 Call OpenAI API
  - Build messages array: [system prompt, ...context messages, new user message]
  - Call `callChatCompletion` with messages
  - Extract response: `completion.choices[0].message.content`
  - Handle OpenAI errors gracefully (rate limits, API errors)
- [ ] 1.4.7 Save messages to Firestore
  - Save user message to `conversations/{conversationId}/messages`
  - Fields: `role: 'user'`, `content`, `timestamp: serverTimestamp()`, `type: 'text'`
  - Save AI response to messages subcollection
  - Fields: `role: 'assistant'`, `content`, `timestamp: serverTimestamp()`
  - Update conversation `updatedAt` field
- [ ] 1.4.8 Return response to frontend
  - Return JSON: `{message: aiResponse, messageId: '...'}`
  - Include appropriate status codes (200, 401, 500)
  - Format error responses consistently
- [ ] 1.4.9 Set up CORS properly
  - Install cors: `npm install cors` in functions/
  - Configure CORS middleware
  - Allow credentials and specific methods (POST)
- [ ] 1.4.10 Test chat endpoint
  - Deploy function: `firebase deploy --only functions`
  - Test with Postman or curl
  - Send mock conversation with valid token
  - Verify response follows Socratic method
  - Check Firestore for saved messages
  - Test error cases (invalid token, missing fields)

**Acceptance Criteria:**

- ✅ Cloud Function deployed successfully
- ✅ Authentication verification works
- ✅ OpenAI API integration functional
- ✅ System prompt enforces Socratic method
- ✅ Messages saved to Firestore correctly
- ✅ Error handling implemented
- ✅ Response follows expected format

---

### Task 1.5: Frontend-Backend Connection

**Goal:** Connect chat UI to backend API and handle state management
**Dependencies:** Task 1.3 (Chat UI), Task 1.4 (Backend)
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 1.5.1 Create API client utility
  - Create `src/services/api.js`
  - Create `callChatAPI(conversationId, message)` function
  - Get auth token: `await auth.currentUser.getIdToken()`
  - Build fetch request with Authorization header
  - POST to Cloud Function endpoint
  - Parse JSON response
  - Handle network errors
  - Export function
- [ ] 1.5.2 Create ChatContext for state management
  - Create `src/contexts/ChatContext.jsx`
  - Set up context with: `messages`, `isLoading`, `error`, `conversationId`
  - Create `sendMessage(content)` function
  - Implement `loadConversation(id)` function
  - Create `createNewConversation()` function
  - Export ChatProvider and useChatContext hook
- [ ] 1.5.3 Implement sendMessage logic
  - Add user message to local state immediately (optimistic update)
  - Set `isLoading = true`
  - Call `callChatAPI` with message
  - On success: Add AI response to messages
  - Save both messages to Firestore
  - Set `isLoading = false`
  - On error: Show error toast, remove optimistic message
- [ ] 1.5.4 Implement conversation loading
  - In `loadConversation`: Fetch messages from Firestore
  - Query: `conversations/{id}/messages` ordered by timestamp
  - Set messages state
  - Handle loading and error states
  - Store current conversationId
- [ ] 1.5.5 Implement new conversation creation
  - Generate unique ID (use Firestore doc ID)
  - Create conversation document with metadata
  - Clear messages array
  - Update conversationId state
  - Navigate to new conversation route
- [ ] 1.5.6 Update ChatContainer to use context
  - Wrap ChatContainer with ChatProvider
  - Replace local state with useChatContext
  - Use context's sendMessage function
  - Display messages from context
  - Show loading state from context
- [ ] 1.5.7 Add error handling UI
  - Show error toasts using react-hot-toast
  - Add retry button on API failures
  - Display user-friendly error messages
  - Handle network offline state
- [ ] 1.5.8 Add conversation initialization
  - On ChatPage mount, check for conversationId in URL
  - If exists: Load that conversation
  - If not: Create new conversation automatically
  - Show loading state during initialization
- [ ] 1.5.9 Persist conversation in URL
  - Use React Router's useParams and useNavigate
  - Update URL when conversation changes
  - Support browser back/forward navigation
- [ ] 1.5.10 Test end-to-end flow
  - Send message from UI → appears in Firestore
  - AI response appears in chat
  - Loading indicator shows during API call
  - Error handling works (test with offline mode)
  - Conversation persists on page refresh
  - Messages display in correct order

**Acceptance Criteria:**

- ✅ User can send message from UI
- ✅ AI responds with Socratic guidance
- ✅ Messages save to Firestore
- ✅ Loading states work correctly
- ✅ Error handling shows user-friendly messages
- ✅ Conversation persists across page refresh
- ✅ Multiple conversations can be created

---

### Task 1.6: Math Rendering with KaTeX

**Goal:** Render mathematical equations in chat messages
**Dependencies:** Task 1.5 (Frontend-Backend Connection)
**Estimated Effort:** 2-3 hours

**Subtasks:**

- [ ] 1.6.1 Install and configure KaTeX
  - Already installed in Task 1.1
  - Import KaTeX CSS in `src/main.jsx` or `index.css`
  - Import: `import 'katex/dist/katex.min.css'`
- [ ] 1.6.2 Create MathRenderer component
  - Create `src/components/shared/MathRenderer.jsx`
  - Accept props: `content` (message text)
  - Use regex to detect `$...$` (inline) and `$$...$$` (block) patterns
  - Parse content into text and math segments
  - Render math segments with KaTeX
  - Use `react-katex` or raw KaTeX API
- [ ] 1.6.3 Implement inline math rendering
  - Detect inline math: `/\$([^\$]+)\$/g`
  - For each match, render with KaTeX in inline mode
  - Keep as `<span>` elements
  - Handle rendering errors (invalid LaTeX)
- [ ] 1.6.4 Implement block math rendering
  - Detect block math: `/\$\$([^\$]+)\$\$/g`
  - For each match, render with KaTeX in display mode
  - Render as centered `<div>` elements
  - Add spacing around block equations
- [ ] 1.6.5 Add error handling for invalid LaTeX
  - Wrap KaTeX rendering in try-catch
  - If error: Display raw text instead of crashing
  - Log error to console for debugging
  - Show fallback: "Error rendering equation: [raw text]"
- [ ] 1.6.6 Integrate MathRenderer into MessageBubble
  - Replace plain text content rendering
  - Use MathRenderer component for all message content
  - Test with messages containing math
  - Ensure text without math still displays normally
- [ ] 1.6.7 Update system prompt to use delimiters
  - In backend prompts.js, add instruction:
  - "Always wrap math with $ for inline ($x^2$) and $$ for block equations ($$\\frac{a}{b}$$)"
  - Test that AI outputs proper delimiters
- [ ] 1.6.8 Create test messages with math
  - Create array of sample math problems for testing:
    - "Solve $2x + 5 = 13$"
    - "The area formula is $$A = \\pi r^2$$"
    - "Simplify $\\frac{3x + 6}{3}$"
  - Render in chat and verify correct display
- [ ] 1.6.9 Style math rendering
  - Adjust font size for readability (slightly larger than text)
  - Ensure proper spacing around equations
  - Test with dark and light backgrounds
  - Add subtle highlighting for block equations (optional)
- [ ] 1.6.10 Test math rendering thoroughly
  - Test inline math renders correctly
  - Test block math centers properly
  - Test mixed text and math in same message
  - Test invalid LaTeX shows fallback
  - Test special symbols: fractions, exponents, square roots, Greek letters
  - Verify rendering on mobile browsers

**Acceptance Criteria:**

- ✅ Inline math renders with KaTeX ($x^2$)
- ✅ Block equations render centered ($$...$$)
- ✅ Text without math displays normally
- ✅ Invalid LaTeX shows graceful fallback
- ✅ Math is readable and properly styled
- ✅ Rendering works across all browsers

---

### Task 1.7: Conversation Persistence

**Goal:** Save and load conversations from Firestore
**Dependencies:** Task 1.5 (Frontend-Backend Connection)
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 1.7.1 Define Firestore data structure
  - Document structure for `conversations/{conversationId}`:
    ```javascript
    {
      conversationId: string,
      uid: string,
      title: string, // First 50 chars of initial problem
      createdAt: timestamp,
      updatedAt: timestamp,
      messageCount: number
    }
    ```
  - Subcollection: `conversations/{conversationId}/messages/{messageId}`
- [ ] 1.7.2 Implement createConversation in backend
  - Create helper function in `functions/src/utils/firestore.js`
  - `createConversation(uid, firstMessage)` function
  - Generate conversation document
  - Set title from first message (trim to 50 chars)
  - Return conversationId
- [ ] 1.7.3 Implement saveMessage function
  - In firestore.js utility
  - `saveMessage(conversationId, role, content, type)` function
  - Add message to subcollection
  - Update conversation `updatedAt` and `messageCount`
  - Use batch write for atomicity
- [ ] 1.7.4 Update chat endpoint to handle new conversations
  - If conversationId is 'new', create new conversation
  - Use first user message as conversation title
  - Return conversationId in response
  - Frontend updates URL with new ID
- [ ] 1.7.5 Implement loadMessages in frontend
  - In `src/services/firestore.js`, create utility
  - `loadMessages(conversationId)` function
  - Query messages subcollection ordered by timestamp
  - Return array of message objects
  - Handle errors
- [ ] 1.7.6 Update ChatContext to load from Firestore
  - In `loadConversation`, call `loadMessages`
  - Set messages state with loaded data
  - Add loading state
  - Handle empty conversations
- [ ] 1.7.7 Implement real-time message sync (optional for MVP)
  - Use Firestore `onSnapshot` for real-time updates
  - Listen to messages subcollection
  - Update local state when new messages added
  - Cleanup listener on unmount
- [ ] 1.7.8 Handle conversation metadata
  - Save conversation title based on first problem
  - Update `updatedAt` on each new message
  - Increment `messageCount`
- [ ] 1.7.9 Test conversation persistence
  - Create new conversation → Verify in Firestore
  - Send messages → Verify saved correctly
  - Refresh page → Messages reload from Firestore
  - Check conversation metadata is accurate
  - Test with multiple conversations
- [ ] 1.7.10 Add error handling for Firestore operations
  - Handle network errors
  - Handle permission errors
  - Show user-friendly error messages
  - Implement retry logic

**Acceptance Criteria:**

- ✅ New conversations create Firestore documents
- ✅ Messages save to Firestore automatically
- ✅ Conversations persist across page refresh
- ✅ Conversation metadata (title, timestamps) accurate
- ✅ Messages load in correct order
- ✅ Error handling works for Firestore operations

---

## Phase 2: Image Upload & OCR

### Task 2.1: Image Upload UI

**Goal:** Add image upload capability to chat input
**Dependencies:** Task 1.3 (Chat UI)
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 2.1.1 Create ImageUpload component
  - Create `src/components/chat/ImageUpload.jsx`
  - Add hidden file input with accept="image/\*"
  - Add camera icon button to trigger file input
  - Handle file selection onChange event
  - Validate file type (jpg, png, heic, webp)
  - Validate file size (max 5MB)
- [ ] 2.1.2 Implement image preview
  - Create local state for selected image
  - Convert File to data URL for preview
  - Display thumbnail (150x150px) in input area
  - Add remove button (X icon) to clear selection
  - Style preview with border and shadow
- [ ] 2.1.3 Add drag-and-drop support
  - Add drop zone overlay to chat area
  - Handle dragOver, dragEnter, dragLeave, drop events
  - Prevent default browser behavior
  - Show visual feedback when dragging over
  - Process dropped file same as file input
- [ ] 2.1.4 Integrate with InputArea
  - Add ImageUpload button to InputArea
  - Show image preview above textarea when selected
  - Disable text input when image is selected (optional)
  - Add "Send" button for image (separate from text send)
- [ ] 2.1.5 Create image compression utility
  - Create `src/utils/imageCompression.js`
  - Use Canvas API to resize large images
  - Target max dimensions: 1024x1024px
  - Maintain aspect ratio
  - Convert to JPEG with quality 0.8
  - Return compressed base64 string
- [ ] 2.1.6 Implement image upload flow
  - User selects image → Show preview
  - User clicks send → Compress image
  - Convert to base64
  - Show uploading state (loading indicator)
  - Clear preview after successful send
- [ ] 2.1.7 Add loading states
  - Show spinner during image compression
  - Show "Analyzing image..." text
  - Disable input during processing
  - Show progress if compression takes time
- [ ] 2.1.8 Display uploaded images in chat
  - Show image in user message bubble
  - Add thumbnail with "View full size" option
  - Create modal for full-size image viewing
  - Use Headless UI Dialog for modal
- [ ] 2.1.9 Handle errors
  - Invalid file type → Show toast error
  - File too large → Show toast error
  - Compression failed → Show toast error
  - Provide clear error messages
- [ ] 2.1.10 Test image upload UI
  - Select image from file picker → Preview shows
  - Drag and drop image → Preview shows
  - Remove image → Preview clears
  - Send image → Appears in chat
  - Test on mobile browsers (camera upload)
  - Test with various image formats and sizes

**Acceptance Criteria:**

- ✅ Camera icon button opens file picker
- ✅ Drag-and-drop works for images
- ✅ Image preview displays before sending
- ✅ Images compress to reasonable size
- ✅ Uploaded images appear in chat
- ✅ Loading states show during processing
- ✅ Error handling works for invalid files
- ✅ Works on mobile browsers with camera

---

### Task 2.2: OCR Backend Processing

**Goal:** Extract math problem text from uploaded images
**Dependencies:** Task 1.4 (Backend), Task 2.1 (Image Upload UI)
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 2.2.1 Create OCR Cloud Function endpoint
  - Create `functions/src/api/ocr.js`
  - Export `ocr` function (onRequest)
  - Set up CORS headers
  - Accept image data (base64 or URL)
- [ ] 2.2.2 Implement authentication for OCR endpoint
  - Extract and verify Firebase ID token
  - Return 401 if invalid
  - Extract uid from token
- [ ] 2.2.3 Create Vision API utility
  - In `functions/src/utils/openai.js`
  - Create `extractTextFromImage(imageData)` function
  - Use GPT-4o-mini with vision capability
  - Build messages array with image_url content type
- [ ] 2.2.4 Design OCR prompt
  - In `prompts.js`, create OCR_EXTRACTION_PROMPT
  - Instruction: "Extract the math problem from this image. Return ONLY the problem text. Use LaTeX for equations if needed. If handwritten, interpret carefully."
  - Keep prompt concise and focused
- [ ] 2.2.5 Call OpenAI Vision API
  - Send image as base64 data URL
  - Format: `data:image/jpeg;base64,{imageData}`
  - Set max_tokens to 300 (sufficient for problem text)
  - Extract response text
- [ ] 2.2.6 Implement text normalization
  - Trim whitespace from extracted text
  - Remove extra line breaks
  - Validate that text was extracted (not empty)
  - Return structured response: `{extractedText: string, confidence: high/medium/low}`
- [ ] 2.2.7 Handle OCR errors
  - Image too blurry: Return error with message
  - No text detected: Return helpful error
  - API failures: Retry with exponential backoff
  - Return consistent error format
- [ ] 2.2.8 Return OCR result to frontend
  - JSON response: `{extractedText: '...', success: true}`
  - Include error field if extraction failed
  - Appropriate status codes
- [ ] 2.2.9 Deploy OCR function
  - Deploy to Firebase: `firebase deploy --only functions:ocr`
  - Test endpoint with sample images
  - Verify authentication works
- [ ] 2.2.10 Test OCR with various image types
  - Test with printed math problem (clear)
  - Test with handwritten problem (neat)
  - Test with handwritten problem (messy)
  - Test with image of whiteboard
  - Test with low quality/blurry image
  - Verify LaTeX formatting in response

**Acceptance Criteria:**

- ✅ OCR endpoint deployed and accessible
- ✅ Extracts text from printed problems accurately
- ✅ Handles handwritten text reasonably well
- ✅ Returns LaTeX formatted equations
- ✅ Error handling works for unreadable images
- ✅ Authentication required for access
- ✅ Response time acceptable (< 5 seconds)

---

### Task 2.3: OCR Integration & Confirmation Flow

**Goal:** Connect image upload to OCR and implement confirmation UI
**Dependencies:** Task 2.1 (Image Upload UI), Task 2.2 (OCR Backend)
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 2.3.1 Create OCR API client function
  - In `src/services/api.js`
  - Create `callOCRAPI(imageBase64)` function
  - Get auth token
  - POST to OCR endpoint with image data
  - Return extracted text
  - Handle errors
- [ ] 2.3.2 Update sendMessage to handle images
  - In ChatContext, modify `sendMessage` to accept image parameter
  - If image provided, call OCR API first
  - Wait for extracted text
  - Show "Analyzing image..." state
- [ ] 2.3.3 Create OCR confirmation component
  - Create `src/components/chat/OCRConfirmation.jsx`
  - Display extracted text in editable textarea
  - Show original image thumbnail for reference
  - Add three buttons: ✓ Confirm | ✏️ Edit | 🔄 Re-upload
  - Style as overlay or modal
- [ ] 2.3.4 Implement confirmation flow logic
  - After OCR completes, show confirmation component
  - User can review extracted text
  - If confirmed: Proceed with text as problem
  - If edited: Use edited text
  - If re-upload: Clear and allow new upload
- [ ] 2.3.5 Handle "Confirm" action
  - Close confirmation modal
  - Send extracted text to chat API
  - Display image in chat as user message
  - Show extracted text below image
  - Continue with Socratic dialogue
- [ ] 2.3.6 Handle "Edit" action
  - Make textarea editable (if not already)
  - User modifies text
  - On confirm: Use modified text
  - Highlight that text was edited (optional UI indicator)
- [ ] 2.3.7 Handle "Re-upload" action
  - Close confirmation
  - Clear selected image
  - Return to image upload state
  - User can select different image
- [ ] 2.3.8 Save image with message
  - Store image as base64 in message document
  - Add `type: 'image'` field
  - Add `extractedText` field
  - Display image thumbnail in MessageBubble
- [ ] 2.3.9 Add OCR error handling UI
  - If OCR fails: Show error message
  - Offer two options: "Try Again" or "Type Manually"
  - If "Type Manually": Clear image, focus text input
  - If "Try Again": Re-run OCR on same image
- [ ] 2.3.10 Test complete image flow
  - Upload image → OCR runs → Confirmation shows
  - Confirm text → Message sent → AI responds
  - Edit text → Modified text sent correctly
  - Re-upload → Can select new image
  - OCR error → Fallback options work
  - Image displays in chat history
  - Test with mobile browser camera upload

**Acceptance Criteria:**

- ✅ Image upload triggers OCR automatically
- ✅ Extracted text shows in confirmation dialog
- ✅ User can confirm, edit, or re-upload
- ✅ Confirmed text sends to chat correctly
- ✅ Images display in chat history
- ✅ Error handling provides alternatives
- ✅ Flow works smoothly end-to-end

---

### Task 2.4: Image Message Display

**Goal:** Show uploaded images in chat history
**Dependencies:** Task 2.3 (OCR Integration)
**Estimated Effort:** 2-3 hours

**Subtasks:**

- [ ] 2.4.1 Update MessageBubble for image messages
  - Check if message has `type: 'image'`
  - Display image thumbnail (max 300px width)
  - Show extracted text below image
  - Add border and spacing
- [ ] 2.4.2 Create ImageModal component
  - Create `src/components/shared/ImageModal.jsx`
  - Use Headless UI Dialog
  - Display full-size image
  - Add close button (X) and ESC key handler
  - Click outside to close
- [ ] 2.4.3 Add "View Full Size" functionality
  - Make image thumbnail clickable
  - On click: Open ImageModal with full image
  - Show loading state if image large
- [ ] 2.4.4 Style image messages
  - Keep consistent with text messages
  - Image in user bubble (right side)
  - Add subtle shadow and border radius
  - Ensure responsive on mobile
- [ ] 2.4.5 Handle image loading states
  - Show skeleton loader while image loads
  - Handle broken images gracefully
  - Add alt text for accessibility
- [ ] 2.4.6 Optimize image storage
  - Compress images before saving to Firestore
  - Consider Firebase Storage for large images (future)
  - For MVP: Store base64 in Firestore (< 1MB)
- [ ] 2.4.7 Test image display
  - Upload and send image → Appears in chat
  - Click image → Full size modal opens
  - Refresh page → Images reload from Firestore
  - Test with multiple images in conversation
  - Verify responsive behavior on mobile

**Acceptance Criteria:**

- ✅ Images display as thumbnails in chat
- ✅ Click image opens full-size view
- ✅ Loading states show for images
- ✅ Images persist in Firestore
- ✅ Responsive design works on all screens
- ✅ Broken images handled gracefully

---

## Phase 3: Conversation History UI

### Task 3.1: Sidebar Component

**Goal:** Build conversation list sidebar
**Dependencies:** Task 1.7 (Conversation Persistence)
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 3.1.1 Create Sidebar component structure
  - Create `src/components/sidebar/Sidebar.jsx`
  - Fixed width: 250px on desktop
  - Collapsible with toggle button
  - Slide-out drawer on mobile (using Headless UI)
- [ ] 3.1.2 Create "New Conversation" button
  - Prominent button at top of sidebar
  - Icon: Plus (+) or chat bubble
  - On click: Create new conversation and navigate
  - Style with primary color, larger than list items
- [ ] 3.1.3 Create ConversationItem component
  - Create `src/components/sidebar/ConversationItem.jsx`
  - Display: Title (truncated to 40 chars), timestamp
  - Show relative time: "2 min ago", "Yesterday", "Jan 15"
  - Highlight active conversation
  - Hover effect: Show delete icon
- [ ] 3.1.4 Create ConversationList component
  - Create `src/components/sidebar/ConversationList.jsx`
  - Group conversations by date: Today, Yesterday, This Week, Older
  - Add section headers for each group
  - Render ConversationItem for each conversation
  - Handle empty state: "No conversations yet"
- [ ] 3.1.5 Fetch user conversations
  - Create `loadUserConversations(uid)` in firestore service
  - Query: `conversations` where `uid == currentUser.uid`
  - Order by `updatedAt` desc
  - Limit: 50 conversations (pagination later)
  - Return array of conversation objects
- [ ] 3.1.6 Implement conversation grouping logic
  - Create utility function `groupConversationsByDate(conversations)`
  - In `src/utils/helpers.js`
  - Group by: Today, Yesterday, This Week, Older
  - Use date comparison logic
  - Return grouped object
- [ ] 3.1.7 Add delete conversation functionality
  - Add delete icon (trash) on hover
  - On click: Show confirmation modal
  - Use Headless UI Dialog for confirmation
  - If confirmed: Delete conversation and all messages
  - Update sidebar list (remove item)
- [ ] 3.1.8 Implement conversation selection
  - Click ConversationItem → Navigate to `/chat/:conversationId`
  - Load conversation messages
  - Highlight selected conversation in sidebar
  - Close drawer on mobile after selection
- [ ] 3.1.9 Add sidebar toggle for mobile
  - Hamburger menu icon in Header
  - On click: Open/close sidebar drawer
  - Drawer slides in from left (Headless UI Transition)
  - Overlay background (click to close)
- [ ] 3.1.10 Style and polish sidebar
  - Apply Tailwind styling
  - Smooth transitions for hover states
  - Proper spacing and typography
  - Scroll overflow for long lists
  - Sticky "New Conversation" button

**Acceptance Criteria:**

- ✅ Sidebar displays list of conversations
- ✅ Conversations grouped by date correctly
- ✅ Click conversation loads it in chat
- ✅ Active conversation highlighted
- ✅ New conversation button works
- ✅ Delete conversation works with confirmation
- ✅ Mobile drawer opens/closes smoothly
- ✅ UI is polished and responsive

---

### Task 3.2: Conversation Navigation

**Goal:** Handle routing and state for multiple conversations
**Dependencies:** Task 3.1 (Sidebar)
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 3.2.1 Update React Router configuration
  - Ensure route: `/chat/:conversationId`
  - Default route `/chat` → Create new conversation
  - Handle invalid conversationId (404)
- [ ] 3.2.2 Create useConversations hook
  - Create `src/hooks/useConversations.js`
  - Manage conversations list state
  - Implement `loadConversations()` function
  - Implement `deleteConversation(id)` function
  - Implement `createConversation()` function
  - Return: conversations, loading, error, functions
- [ ] 3.2.3 Integrate hook with Sidebar
  - Use `useConversations` in Sidebar component
  - Display loading skeleton while loading
  - Handle error state (show message)
  - Pass conversations to ConversationList
- [ ] 3.2.4 Update ChatContext for conversation switching
  - Add `switchConversation(id)` function
  - Clear current messages
  - Load new conversation messages
  - Update URL with navigate
- [ ] 3.2.5 Handle conversation ID from URL
  - In ChatPage, use `useParams` to get conversationId
  - On mount or ID change: Load that conversation
  - If no ID: Create new conversation
  - Show loading state during load
- [ ] 3.2.6 Preserve scroll position
  - When switching conversations, save scroll position
  - Restore scroll when returning to conversation
  - Use refs or sessionStorage
- [ ] 3.2.7 Handle browser back/forward
  - Ensure back button loads previous conversation
  - Forward button loads next conversation
  - React Router handles this automatically if URL updated
- [ ] 3.2.8 Add conversation creation from sidebar
  - "New Conversation" button calls `createConversation()`
  - Navigate to new conversation ID
  - Clear chat and show empty state
- [ ] 3.2.9 Implement delete conversation with state update
  - After deletion, remove from sidebar list
  - If deleted conversation is active: Navigate to most recent
  - Update conversations state immediately
- [ ] 3.2.10 Test navigation flow
  - Click conversation → Loads correctly
  - Create new → Empty chat appears
  - Delete conversation → Removed from list
  - Browser back → Previous conversation loads
  - Refresh page → Current conversation persists
  - Switch between conversations smoothly

**Acceptance Criteria:**

- ✅ Clicking conversation loads it correctly
- ✅ URL updates with conversation ID
- ✅ Browser navigation works (back/forward)
- ✅ Creating new conversation works
- ✅ Deleting conversation updates UI
- ✅ State management handles multiple conversations
- ✅ Page refresh maintains current conversation

---

### Task 3.3: Empty States & Polish

**Goal:** Add empty states and UI polish for conversation management
**Dependencies:** Task 3.2 (Conversation Navigation)
**Estimated Effort:** 2-3 hours

**Subtasks:**

- [ ] 3.3.1 Create empty sidebar state
  - When no conversations exist
  - Show illustration or icon
  - Message: "No conversations yet. Start your first problem!"
  - Add quick-start example problems as buttons
- [ ] 3.3.2 Create empty chat state
  - When new conversation with no messages
  - Show welcome message from tutor
  - Display example problems user can click:
    - "Solve 2x + 5 = 13"
    - "Find the area of a circle with radius 7cm"
    - "If John has 3 apples and buys 5 more..."
  - Clicking example sends it as first message
- [ ] 3.3.3 Add loading skeleton for conversation list
  - Show skeleton items while loading conversations
  - Shimmer animation effect
  - 5-6 skeleton items with placeholder text
- [ ] 3.3.4 Add loading skeleton for messages
  - Show skeleton messages while loading conversation
  - Alternate left/right (tutor/user) placeholders
  - 3-4 skeleton messages
- [ ] 3.3.5 Create delete confirmation modal
  - Use Headless UI Dialog
  - Title: "Delete Conversation?"
  - Message: "This will permanently delete all messages."
  - Buttons: "Cancel" (secondary) | "Delete" (danger red)
  - Animate in/out smoothly
- [ ] 3.3.6 Add conversation title generation
  - When first message sent, create title
  - Take first 50 characters of problem
  - Remove special characters, trim whitespace
  - Update conversation document in Firestore
  - Display in sidebar immediately
- [ ] 3.3.7 Polish transitions and animations
  - Smooth transition when opening/closing sidebar
  - Fade in conversations list
  - Slide animation for drawer on mobile
  - Hover effects on conversation items
  - Active state highlight animation
- [ ] 3.3.8 Add relative timestamps
  - Create utility function for relative time
  - "Just now", "2 min ago", "1 hour ago"
  - "Yesterday", "Monday", "Jan 15"
  - Update in ConversationItem component
- [ ] 3.3.9 Implement search/filter (optional)
  - Add search input at top of sidebar
  - Filter conversations by title
  - Show "No results" if filter returns empty
  - Clear search button (X icon)
- [ ] 3.3.10 Test all empty and edge states
  - First-time user with no conversations
  - User with one conversation
  - User with 20+ conversations
  - Deleting last conversation
  - Loading states appear/disappear correctly
  - Error states display properly

**Acceptance Criteria:**

- ✅ Empty states show helpful messages
- ✅ Example problems work in empty chat
- ✅ Loading skeletons display during fetches
- ✅ Delete confirmation prevents accidents
- ✅ Conversation titles auto-generate
- ✅ Animations smooth and polished
- ✅ Relative timestamps display correctly
- ✅ All edge cases handled gracefully

---

## Phase 4: UI/UX Polish & Testing

### Task 4.1: Visual Design Polish

**Goal:** Apply final design system and polish all UI elements
**Dependencies:** All Phase 1-3 tasks
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 4.1.1 Implement color palette consistently
  - Primary: Indigo 600 → Purple 500 gradient
  - Secondary: Teal 500
  - Background: Gray 50 (light mode)
  - Update all components with consistent colors
  - Create Tailwind theme customization in config
- [ ] 4.1.2 Apply typography system
  - Install Inter font from Google Fonts
  - Set as default font family in Tailwind config
  - Heading sizes: text-2xl, text-xl, text-lg
  - Body text: text-base (16px), line-height 1.6
  - Apply throughout app
- [ ] 4.1.3 Polish message bubbles
  - Tutor: Soft indigo/purple gradient, rounded corners
  - User: White with subtle shadow, rounded corners
  - Add tutor avatar (small icon, left of message)
  - Proper padding: px-4 py-3
  - Max width: prose (65ch) for readability
- [ ] 4.1.4 Polish input area
  - Rounded border, focus ring (primary color)
  - Icon buttons: Subtle hover effect, scale(1.05)
  - Send button: Primary gradient, disabled state gray
  - Proper spacing between elements
- [ ] 4.1.5 Polish sidebar
  - Conversation items: Hover bg-gray-100, active bg-primary-50
  - Delete icon: Appears on hover, red color
  - Section headers: Uppercase, text-xs, font-semibold, text-gray-500
  - Proper padding and spacing
- [ ] 4.1.6 Add micro-interactions
  - Message send: Fade in + slide up (200ms)
  - Button hover: Scale(1.02) + shadow (150ms)
  - Input focus: Smooth ring animation
  - Sidebar item hover: Subtle background transition
  - Modal open/close: Fade + scale animation
- [ ] 4.1.7 Refine spacing and layout
  - Consistent padding: 4, 6, 8 units (16px, 24px, 32px)
  - Message spacing: mb-4 between messages
  - Section spacing: mb-6 or mb-8
  - Container max-width: max-w-7xl, centered
- [ ] 4.1.8 Polish header
  - Logo with gradient text or icon
  - Profile dropdown: Smooth transition, proper shadow
  - Hamburger menu: Animated icon (open/close)
  - Sticky positioning with subtle shadow on scroll
- [ ] 4.1.9 Add loading shimmer effects
  - Skeleton loaders with shimmer animation
  - Pulse effect for loading states
  - Spinner for button loading states
- [ ] 4.1.10 Create style guide documentation
  - Document colors, typography, spacing
  - Screenshot component states (default, hover, active, disabled)
  - Add to README or separate STYLEGUIDE.md

**Acceptance Criteria:**

- ✅ Consistent color palette applied throughout
- ✅ Typography system implemented
- ✅ All components visually polished
- ✅ Micro-interactions smooth and delightful
- ✅ Spacing and layout consistent
- ✅ Loading states well-designed
- ✅ App looks professional and modern

---

### Task 4.2: Accessibility Implementation

**Goal:** Ensure app is accessible to all users
**Dependencies:** Task 4.1 (Visual Polish)
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 4.2.1 Add semantic HTML
  - Use proper heading hierarchy (h1, h2, h3)
  - Use <nav>, <main>, <article>, <section>
  - Label form inputs with <label> elements
  - Use <button> for clickable elements (not divs)
- [ ] 4.2.2 Implement keyboard navigation
  - All interactive elements focusable with Tab
  - Modals: Trap focus, ESC to close
  - Enter key: Send message, submit forms
  - Arrow keys: Navigate lists (optional)
  - Test entire flow with keyboard only
- [ ] 4.2.3 Add ARIA labels and attributes
  - Icon buttons: aria-label="Upload image"
  - Loading states: aria-busy="true"
  - Modals: aria-modal="true", aria-labelledby
  - Live regions: aria-live="polite" for messages
  - Hidden elements: aria-hidden="true"
- [ ] 4.2.4 Ensure color contrast (WCAG AA)
  - Check all text/background combinations
  - Use contrast checker tool
  - Fix low contrast issues (min 4.5:1 for normal text)
  - Test with grayscale to verify usability
- [ ] 4.2.5 Add focus indicators
  - Visible focus ring on all interactive elements
  - Custom focus ring with primary color
  - Focus-visible (only on keyboard focus, not mouse)
  - Test with Tab key navigation
- [ ] 4.2.6 Implement alt text for images
  - Alt text for all images in messages
  - Describe uploaded images meaningfully
  - Decorative images: alt=""
- [ ] 4.2.7 Add skip links
  - "Skip to main content" link at top
  - Hidden by default, appears on focus
  - Jumps to main chat area
- [ ] 4.2.8 Test with screen reader
  - Test with NVDA (Windows) or VoiceOver (Mac)
  - Ensure messages are announced
  - Verify form labels read correctly
  - Check navigation announces properly
- [ ] 4.2.9 Add loading announcements
  - Screen reader announces "Loading messages"
  - "Sending message" announcement
  - "Image uploaded" announcement
  - Use aria-live regions
- [ ] 4.2.10 Create accessibility documentation
  - Document keyboard shortcuts
  - List accessible features
  - Add to README

**Acceptance Criteria:**

- ✅ Full keyboard navigation works
- ✅ Screen reader compatible
- ✅ WCAG AA contrast compliance
- ✅ Focus indicators visible
- ✅ ARIA labels properly applied
- ✅ Semantic HTML used throughout
- ✅ No accessibility errors in Lighthouse

---

### Task 4.3: Responsive Design & Mobile Optimization

**Goal:** Ensure perfect experience on all screen sizes
**Dependencies:** Task 4.1 (Visual Polish)
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 4.3.1 Define breakpoints
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
  - Test at each breakpoint
- [ ] 4.3.2 Optimize layout for mobile browsers
  - Sidebar: Full-screen drawer (slide from left)
  - Chat: Full width when sidebar closed
  - Header: Compact, hamburger menu
  - Input: Full width, stacked buttons if needed
- [ ] 4.3.3 Optimize message bubbles for mobile
  - Reduce padding slightly on small screens
  - Max width: 85% of screen
  - Font size: Slightly smaller on mobile (14px)
  - Ensure math renders readable size
- [ ] 4.3.4 Touch-friendly targets
  - All buttons minimum 48x48px
  - Increase spacing between clickable elements
  - Larger tap targets for icons
  - Test with finger (not stylus)
- [ ] 4.3.5 Optimize image upload for mobile
  - Camera access on mobile browsers
  - Full-screen image preview on mobile
  - Compress images aggressively on mobile
  - Handle device orientation changes
- [ ] 4.3.6 Handle mobile keyboard
  - Input area stays above keyboard
  - Chat scrolls to show input when keyboard opens
  - Use appropriate input types (email, text)
  - Prevent zoom on input focus (font-size: 16px minimum)
- [ ] 4.3.7 Optimize sidebar drawer for mobile
  - Smooth slide animation (300ms)
  - Backdrop overlay (semi-transparent black)
  - Swipe to close gesture
  - Close on conversation selection
- [ ] 4.3.8 Test on real mobile devices
  - iOS Safari (iPhone)
  - Android Chrome (various screen sizes)
  - Test portrait and landscape
  - Test with slow 3G network
- [ ] 4.3.9 Optimize performance for mobile
  - Lazy load images
  - Reduce bundle size (code splitting)
  - Minimize re-renders
  - Test Core Web Vitals
- [ ] 4.3.10 Add mobile-specific features
  - Pull-to-refresh conversations list (optional)
  - Haptic feedback on actions (optional)
  - Share conversation (Web Share API, optional)

**Acceptance Criteria:**

- ✅ Perfect layout on all screen sizes
- ✅ Touch targets appropriately sized
- ✅ Mobile keyboard handled correctly
- ✅ Sidebar drawer works smoothly on mobile
- ✅ Image upload works from mobile camera
- ✅ Tested on real iOS and Android devices
- ✅ Performance acceptable on mobile networks
- ✅ No horizontal scroll on any screen size

---

### Task 4.4: Comprehensive Testing with Problems

**Goal:** Test AI tutor with diverse math problems
**Dependencies:** All previous tasks
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 4.4.1 Create test problem suite
  - Compile 15+ diverse math problems:
    1. Simple arithmetic: "48 ÷ 6"
    2. Basic algebra: "Solve: 2x + 5 = 13"
    3. Word problem: "John has 3 apples, buys 5 more. How many total?"
    4. Geometry: "Find area of circle with radius 7cm"
    5. Multi-step: "Simplify: 2(x + 3) + 4(x - 1)"
    6. Fractions: "1/2 + 1/3 = ?"
    7. Quadratic: "Solve: x² - 5x + 6 = 0"
    8. Percentage: "What is 15% of 80?"
    9. Pythagorean: "Find hypotenuse: sides 3 and 4"
    10. System of equations: "x + y = 10, x - y = 2"
    11. Exponents: "Simplify: 2³ × 2⁴"
    12. Square root: "√144 = ?"
    13. Order of operations: "5 + 3 × 2 - 4 ÷ 2"
    14. Graphing: "Find slope of line through (2,3) and (4,7)"
    15. Trigonometry: "sin(30°) = ?"
- [ ] 4.4.2 Test Socratic method effectiveness
  - For each problem, verify AI:
    - Asks guiding questions (not direct answers)
    - Validates student responses with encouragement
    - Provides hints when stuck (not solutions)
    - Asks one question at a time
    - Adapts to student understanding
  - Document any failures or direct answers given
- [ ] 4.4.3 Test with "give me the answer" requests
  - Try: "Just tell me the answer"
  - Try: "What's x equal to?"
  - Try: "Can you solve it for me?"
  - Verify AI refuses politely and redirects to questions
- [ ] 4.4.4 Test math rendering
  - Verify all equations render correctly
  - Check inline math: $x^2 + 5$
  - Check block equations: $\frac{a}{b} = c$
  - Test fractions, exponents, roots, Greek letters
  - Verify rendering on mobile browsers
- [ ] 4.4.5 Test image upload with printed problems
  - Print 5 math problems on paper
  - Upload photos of each
  - Verify OCR extracts correctly
  - Check LaTeX formatting preserved
  - Confirm AI understands extracted problem
- [ ] 4.4.6 Test image upload with handwritten problems
  - Write 5 problems by hand (neat handwriting)
  - Upload photos
  - Verify OCR accuracy (may need editing)
  - Test confirmation and edit flow
  - Note success rate
- [ ] 4.4.7 Test conversation persistence
  - Start conversation, send 5 messages
  - Refresh page → Verify conversation loads
  - Close browser, reopen → Verify still there
  - Create multiple conversations → Switch between them
  - Delete conversation → Verify removed
- [ ] 4.4.8 Test error scenarios
  - Network offline: Send message → Error handled
  - Invalid image: Upload non-image → Error shown
  - Large image: Upload 10MB file → Error or compression
  - API failure: Simulate 500 error → Retry works
  - Empty message: Try sending blank → Prevented
- [ ] 4.4.9 Performance testing
  - Measure message send latency (<4s)
  - Test with 50+ messages in conversation
  - Check memory usage (no leaks)
  - Test with slow 3G network simulation
  - Verify no UI freezing
- [ ] 4.4.10 Create test report
  - Document all test results
  - List any bugs or issues found
  - Note Socratic method success rate
  - Include screenshots of successful flows
  - Add to project documentation

**Acceptance Criteria:**

- ✅ AI successfully guides through 15+ problem types
- ✅ Socratic method maintained (no direct answers)
- ✅ Math renders correctly in all cases
- ✅ Image OCR works for printed and handwritten text
- ✅ Conversation persistence reliable
- ✅ Error handling graceful in all scenarios
- ✅ Performance meets targets
- ✅ Test documentation complete

---

### Task 4.5: Cross-Browser Testing

**Goal:** Ensure compatibility across major browsers
**Dependencies:** Task 4.4 (Testing with Problems)
**Estimated Effort:**

**Subtasks:**

- [ ] 4.5.1 Test on Chrome desktop
  - Windows Chrome latest version
  - macOS Chrome latest version
  - Test all core features (auth, chat, image upload, math rendering)
  - Verify animations smooth
  - Check DevTools for errors
- [ ] 4.5.2 Test on Firefox desktop
  - Windows Firefox latest version
  - macOS Firefox latest version
  - Test authentication flows
  - Verify math rendering (KaTeX)
  - Check console for warnings/errors
- [ ] 4.5.3 Test on Safari desktop (macOS)
  - Latest Safari version
  - Test all features
  - Pay special attention to CSS compatibility
  - Verify Firebase works correctly
  - Check Web Speech API availability
- [ ] 4.5.4 Test on Edge desktop
  - Windows Edge latest version
  - Quick smoke test of main features
  - Should work like Chrome (Chromium-based)
- [ ] 4.5.5 Test on Chrome mobile (Android)
  - Real Android device or emulator
  - Test responsive layout
  - Camera upload from device
  - Touch interactions
  - Virtual keyboard behavior
- [ ] 4.5.6 Test on Safari mobile (iOS)
  - Real iPhone or simulator
  - Test responsive layout
  - Camera upload
  - Touch interactions
  - iOS-specific quirks (input zoom, keyboard)
- [ ] 4.5.7 Test on Firefox mobile
  - Android device
  - Basic functionality test
  - Note any inconsistencies
- [ ] 4.5.8 Document browser-specific issues
  - Create compatibility matrix
  - List known issues per browser
  - Note workarounds or limitations
  - Update README with browser support info
- [ ] 4.5.9 Fix critical browser bugs
  - Fix any blocking issues found
  - Add browser-specific CSS if needed
  - Implement feature detection for unsupported features
- [ ] 4.5.10 Add browser compatibility notes
  - Document in README: "Supported Browsers"
  - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
  - Note any features not available in certain browsers
  - Recommend Chrome for best experience

**Acceptance Criteria:**

- ✅ Works on Chrome, Firefox, Safari, Edge (desktop)
- ✅ Works on Chrome, Safari (mobile browsers)
- ✅ All critical features functional across browsers
- ✅ Known issues documented
- ✅ No console errors on any browser
- ✅ Visual consistency across browsers
- ✅ Browser support documented

---

### Task 4.6: Performance Optimization

**Goal:** Optimize app performance and load times
**Dependencies:** All Phase 4 tasks
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 4.6.1 Run Lighthouse audit
  - Run on main pages (login, chat)
  - Target scores: 90+ on all metrics
  - Note any issues flagged
  - Screenshot baseline scores
- [ ] 4.6.2 Optimize bundle size
  - Analyze bundle with Vite build analyzer
  - Implement code splitting for routes
  - Lazy load non-critical components
  - Remove unused dependencies
  - Check bundle size < 500KB gzipped
- [ ] 4.6.3 Optimize images
  - Compress uploaded images before storage
  - Use appropriate image formats (WebP where possible)
  - Implement lazy loading for image messages
  - Add loading="lazy" attribute
- [ ] 4.6.4 Optimize component rendering
  - Use React.memo for expensive components
  - Implement useMemo for expensive calculations
  - Use useCallback for event handlers
  - Avoid unnecessary re-renders
  - Check with React DevTools Profiler
- [ ] 4.6.5 Optimize Firestore queries
  - Add indexes for common queries
  - Limit query results (pagination)
  - Cache conversation list locally
  - Use query cursors for pagination (future)
- [ ] 4.6.6 Implement service worker caching
  - Cache static assets (CSS, JS, fonts)
  - Cache Firebase config
  - Offline page for network errors
  - Update strategy: cache-first for assets
- [ ] 4.6.7 Optimize Firebase Functions
  - Set appropriate memory allocation (256MB)
  - Implement connection pooling for Firestore
  - Reduce cold start times
  - Monitor function execution times
- [ ] 4.6.8 Add loading optimizations
  - Implement skeleton screens everywhere
  - Prefetch next conversation on hover (optional)
  - Debounce input handlers
  - Throttle scroll listeners
- [ ] 4.6.9 Monitor Core Web Vitals
  - Measure LCP (Largest Contentful Paint): < 2.5s
  - Measure FID (First Input Delay): < 100ms
  - Measure CLS (Cumulative Layout Shift): < 0.1
  - Fix any issues identified
- [ ] 4.6.10 Re-run Lighthouse and document improvements
  - Compare before/after scores
  - Document optimizations made
  - Set up monitoring (optional: Firebase Performance)

**Acceptance Criteria:**

- ✅ Lighthouse scores 90+ on all metrics
- ✅ Bundle size optimized and reasonable
- ✅ Page load time < 2 seconds
- ✅ Message send latency < 4 seconds
- ✅ No performance warnings in console
- ✅ Smooth interactions (60fps)
- ✅ Core Web Vitals in green zone

---

## Phase 5: Stretch Features

### Task 5.1: Interactive Whiteboard - Modal Interface

**Goal:** Build modal whiteboard that slides up from bottom with drawing tools
**Dependencies:** Phase 1-3 complete
**Estimated Effort:** 5-6 hours

**Subtasks:**

- [ ] 5.1.1 Install whiteboard drawing library
  - Install: `npm install react-canvas-draw` (or similar)
  - Alternative: Use native HTML5 Canvas API with custom handlers
  - Choose library that supports: pen, eraser, undo, clear, touch support
- [ ] 5.1.2 Create WhiteboardModal component
  - Create `src/components/whiteboard/WhiteboardModal.jsx`
  - Position: Fixed, bottom 0, height 40vh (40% of viewport)
  - Slides up from bottom with Tailwind animation
  - Z-index: Above chat, below other modals
  - Background: White/light gray with rounded top corners
- [ ] 5.1.3 Create Canvas drawing component
  - Create `src/components/whiteboard/WhiteboardCanvas.jsx`
  - Full-size canvas (fills modal area except header/footer)
  - Support: Pen tool, eraser tool, basic shapes (line, circle, rectangle)
  - Blank white background
  - Smooth drawing with proper touch support
- [ ] 5.1.4 Implement whiteboard toolbar (header)
  - Position: Top of modal
  - Left: X button (close icon only)
  - Center: Optional title or empty space
  - State: Persist when closed (don't clear immediately)
  - Style: Clean, minimal header bar
- [ ] 5.1.5 Implement action buttons (footer)
  - Position: Bottom of modal
  - Left: Clear button (🗑️ icon only) - warns "Clear all drawings?"
  - Right: Send button (✓ or ✈️ icon only)
  - Both icon-only for modern aesthetic
  - Proper spacing between buttons
- [ ] 5.1.6 Implement drawing tools
  - Tool 1: Pen (default) - draws freehand strokes
  - Tool 2: Eraser - removes strokes
  - Tool 3-5: Basic shapes - Line, Circle, Rectangle
  - Toolbar: Horizontal row below canvas (or collapsible menu)
  - Active tool: Visual indicator (highlight/color)
- [ ] 5.1.7 Implement undo functionality
  - Undo button next to tools
  - Each stroke/shape action can be undone
  - Disable when no actions to undo
  - Keyboard shortcut: Ctrl+Z / Cmd+Z
- [ ] 5.1.8 Create WhiteboardContext
  - State: `isWhiteboardOpen: boolean`
  - State: `canvasRef: ref` - store canvas reference
  - State: `selectedTool: string` - pen, eraser, line, circle, rectangle
  - Function: `openWhiteboard()`, `closeWhiteboard()`, `clearWhiteboard()`
  - Function: `sendWhiteboard()` - convert to image and send
- [ ] 5.1.9 Add whiteboard button to InputArea
  - In chat input area, add 🎨 icon button (above text field)
  - Icon only, no label
  - On click: Open whiteboard modal
  - Tooltip on hover: "Open Whiteboard"
  - Position: Above text input on left or right side
- [ ] 5.1.10 Test modal behavior and appearance
  - Click whiteboard button → Modal slides up from bottom
  - Modal covers ~40% of screen height
  - Drawing tools render correctly
  - X button closes (state persists)
  - Clear button clears canvas with confirmation
  - Send button appears ready for next steps
  - Mobile responsive (40vh scales appropriately)

**Acceptance Criteria:**

- ✅ Whiteboard modal slides up from bottom smoothly
- ✅ Modal height is 40% of viewport
- ✅ X button closes without clearing
- ✅ Clear button removes all content with confirmation
- ✅ Canvas ready for drawing tools
- ✅ All buttons are icon-only
- ✅ Modal state persists until cleared or sent
- ✅ Responsive on mobile

---

### Task 5.2: Canvas Drawing Implementation

**Goal:** Implement pen, eraser, shapes, and undo functionality
**Dependencies:** Task 5.1 (Modal Interface)
**Estimated Effort:** 5-6 hours

**Subtasks:**

- [ ] 5.2.1 Implement pen tool
  - Enable freehand drawing with mouse/touch
  - Smooth stroke rendering
  - Default color: Black
  - Default stroke width: 2px
  - Store strokes in state for undo
- [ ] 5.2.2 Implement eraser tool
  - Toggle from pen to eraser
  - Erase previous strokes by detecting overlap
  - Visual feedback: Different cursor appearance
  - Maintain ability to undo erased content
- [ ] 5.2.3 Implement basic shapes
  - Line: Click start point, drag to end
  - Circle: Click center, drag for radius
  - Rectangle: Click corner, drag to opposite corner
  - Preview shapes while dragging (optional)
  - All shapes use current stroke color/width
- [ ] 5.2.4 Implement undo/redo
  - Store action history (each stroke/shape)
  - Undo button: Remove last action
  - Redo button (optional): Restore last undone action
  - Keyboard: Ctrl+Z (undo), Ctrl+Shift+Z (redo)
  - Max history: 50 actions to prevent memory issues
- [ ] 5.2.5 Create tool selection UI
  - Toolbar row with icon buttons
  - Pen tool (default)
  - Eraser tool
  - Line shape
  - Circle shape
  - Rectangle shape
  - Active tool highlighted with different styling
- [ ] 5.2.6 Implement tool persistence
  - Remember selected tool when modal closed
  - Reopen modal → Last used tool selected
  - Store in state (or sessionStorage)
- [ ] 5.2.7 Add optional text caption area
  - Small text input below canvas (or in footer)
  - Optional: Add caption/description for whiteboard
  - Placeholder: "Add caption (optional)"
  - Sent along with drawing image
- [ ] 5.2.8 Test drawing on desktop
  - Draw with pen → Smooth strokes appear
  - Switch to eraser → Erases strokes
  - Draw shapes → Appear on canvas
  - Undo → Last action removed
  - Redo → Action restored (if implemented)
- [ ] 5.2.9 Test drawing on mobile/touch
  - Touch drawing → Responds smoothly
  - Multi-touch: Prevent pinch/zoom while drawing
  - Eraser on touch → Works smoothly
  - Shapes on touch → Intuitive creation
- [ ] 5.2.10 Test edge cases
  - Draw on blank canvas → Works
  - Undo multiple times → Goes to blank canvas
  - Undo then draw new → Previous deleted
  - Clear then draw → Canvas fresh
  - Switch tools repeatedly → No glitches

**Acceptance Criteria:**

- ✅ Pen draws smooth freehand strokes
- ✅ Eraser removes content
- ✅ Basic shapes draw correctly
- ✅ Undo works reliably
- ✅ Tools persist between modal open/close
- ✅ Touch drawing smooth and responsive
- ✅ No lag or visual glitches
- ✅ All tools work on desktop and mobile

---

### Task 5.3: Image Conversion & Chat Integration

**Goal:** Convert whiteboard drawing to image and send as message
**Dependencies:** Task 5.2 (Drawing Implementation)
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 5.3.1 Create canvas-to-image conversion function
  - Export canvas as PNG image data
  - Create Blob from canvas data
  - Store as base64 or Blob (for upload to Firebase Storage)
- [ ] 5.3.2 Integrate with sendMessage function
  - Modify ChatContext.sendMessage to accept whiteboard image
  - Optional caption text from textarea
  - Convert drawing to image before sending
  - Save to Firebase Storage (similar to uploaded images)
- [ ] 5.3.3 Create message structure for whiteboard
  - Message object with:
    - `type: 'whiteboard'`
    - `imageUrl: string` (Firebase Storage URL)
    - `caption: string` (optional)
    - `role: 'user'`
    - `timestamp`
    - Store extracted text: Use OCR on whiteboard if math-heavy
- [ ] 5.3.4 Update MessageBubble for whiteboard messages
  - Display whiteboard image as thumbnail (max 300px)
  - Show caption below image if provided
  - Modal to view full-size image
  - Similar styling to uploaded images
- [ ] 5.3.5 Implement Send button handler
  - On click: Convert canvas to image
  - Upload to Firebase Storage (in `images/{userId}/{conversationId}/` folder)
  - Get download URL
  - Create message object with type: 'whiteboard'
  - Save to Firestore
  - Show sending state (spinner)
  - Close modal and clear canvas after success
- [ ] 5.3.6 Add error handling
  - Handle canvas export errors
  - Handle Firebase Storage upload errors
  - Show user-friendly error messages with toast
  - Provide retry option
- [ ] 5.3.7 Create optional OCR for whiteboard
  - If whiteboard contains text/equations, extract with Vision API
  - Similar to image OCR flow
  - Extract recognized text as `extractedText` field
  - Send extracted text to chat API for Socratic response
- [ ] 5.3.8 Test sending whiteboard
  - Draw simple shape → Send → Appears in chat as image
  - Add caption → Send → Caption shows below image
  - Multiple drawings → All send correctly
  - Refresh page → Whiteboard image persists in Firestore
- [ ] 5.3.9 Test whiteboard with Socratic response
  - Send whiteboard with math problem (drawing or text)
  - AI receives extracted text
  - AI responds with Socratic guidance
  - Conversation continues normally
- [ ] 5.3.10 Test on mobile and desktop
  - Whiteboard send flow works on mobile
  - Image uploads to Firebase correctly
  - Image displays in chat on refresh
  - No sizing or display issues

**Acceptance Criteria:**

- ✅ Whiteboard drawing converts to image
- ✅ Image uploads to Firebase Storage
- ✅ Message saved to Firestore with correct type
- ✅ Whiteboard image displays in chat
- ✅ Optional caption displays correctly
- ✅ Modal closes and clears after send
- ✅ Image persists across page refresh
- ✅ Socratic responses work with whiteboard
- ✅ Works on desktop and mobile

---

### Task 5.4: Voice Interface (Speech-to-Text & Text-to-Speech)

**Goal:** Add voice input and output capabilities
**Dependencies:** All Phase 1-3, Task 5.1-5.3 complete
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 5.4.1 Implement Speech-to-Text
  - Use Web Speech API (browser native)
  - Add microphone icon button to InputArea
  - On click: Start listening for speech
  - Transcribe to text
  - Insert into text input field
- [ ] 5.4.2 Create voice recording UI
  - Show recording indicator (animated circle)
  - Show transcribed text in real-time (if API supports)
  - Stop button or auto-stop after silence
  - Permission request for microphone
- [ ] 5.4.3 Handle voice input errors
  - Microphone not available: Show error
  - Network error: Show error
  - No speech detected: "Please try again"
  - Invalid browser: Disable feature
- [ ] 5.4.4 Implement Text-to-Speech
  - Create utility function for speech output
  - Use Web Speech API (SpeechSynthesis)
  - Add volume control
  - Add playback speed control
  - Cache synthesized audio (optional)
- [ ] 5.4.5 Add voice button to AI responses
  - Speaker icon button on tutor messages
  - On click: Play audio of message
  - Highlight message while playing
  - Stop button during playback
- [ ] 5.4.6 Implement voice settings
  - Settings menu: Language, voice type, speed, volume
  - Store preferences in localStorage
  - Apply on app load
- [ ] 5.4.7 Handle browser compatibility
  - Check for Web Speech API support
  - Graceful fallback if unsupported
  - Show feature availability note in UI
  - Test on multiple browsers
- [ ] 5.4.8 Test voice-to-text
  - Record message → Appears in input
  - Send voice message → Sent to API
  - Multiple messages → All work correctly
  - Error handling → Shows appropriate messages
- [ ] 5.4.9 Test text-to-speech
  - Click speaker → Message plays aloud
  - Multiple messages → Each plays correctly
  - Stop/pause works → Can restart
  - Speed/volume settings apply
- [ ] 5.4.10 Test on mobile
  - Microphone access works on mobile
  - Speaker output plays on device
  - Touch UI responsive and intuitive
  - No console errors

**Acceptance Criteria:**

- ✅ Speech-to-text transcribes user input
- ✅ Text-to-speech plays AI responses
- ✅ Voice settings persist
- ✅ Works on major browsers
- ✅ Graceful fallback on unsupported browsers
- ✅ Error handling for permissions/failures
- ✅ Mobile compatible
- ✅ Improves accessibility for users

---

### Task 5.5: Problem Generation

**Goal:** Auto-generate practice problems from solved problems
**Dependencies:** All Phase 1-5 tasks
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 5.5.1 Create problem generation prompt
  - In `functions/src/utils/prompts.js`
  - Design prompt: "Given this solved problem, generate 2-3 similar practice problems"
  - Vary difficulty slightly
  - Include LaTeX formatting
  - Different numbers but same concept
- [ ] 5.5.2 Create problem generation Cloud Function
  - Create `functions/src/api/generateProblems.js`
  - Accept: `solvedProblem`, `numberOfProblems` (1-3)
  - Call OpenAI with generation prompt
  - Return array of generated problems
  - CORS and authentication like chat function
- [ ] 5.5.3 Add "Generate Practice" button
  - In chat, after tutor response
  - Button: "📚 Generate Similar Problems"
  - On click: Call generation endpoint
  - Show 2-3 generated problems as clickable buttons
- [ ] 5.5.4 Implement problem card UI
  - Display generated problems in card format
  - Problem text with LaTeX support
  - Difficulty indicator (optional)
  - Click to use as new chat message
- [ ] 5.5.5 Handle problem generation state
  - Loading state while generating
  - Display loading skeleton
  - Error handling if generation fails
  - Dismiss/hide generated problems
- [ ] 5.5.6 Store generated problems (optional)
  - Save to Firestore for analytics
  - Track which problems were used
  - Allow user to save as practice problem
- [ ] 5.5.7 Test problem generation
  - Complete a math problem
  - Click "Generate Problems"
  - 2-3 new problems appear
  - Click problem → Sent as new message
  - AI responds to new problem correctly
- [ ] 5.5.8 Test on various problem types
  - Linear equations
  - Geometry
  - Word problems
  - Algebra
  - Verify generated problems are similar
- [ ] 5.5.9 Verify LaTeX formatting
  - Generated problems include proper LaTeX
  - Render correctly in UI
  - No formatting errors
- [ ] 5.5.10 Test edge cases
  - Very simple problems → Generate similar
  - Complex problems → Generate reasonable variants
  - Text-only problems → Generate text problems
  - Image problems → Generate from OCR text

**Acceptance Criteria:**

- ✅ Cloud Function generates valid problems
- ✅ Generated problems semantically similar
- ✅ UI displays problems clearly
- ✅ Clicking problem sends it as message
- ✅ Works with all problem types
- ✅ LaTeX renders correctly
- ✅ Error handling graceful
- ✅ Helps with practice and learning

---

## Phase 6: Deployment & Documentation

### Task 6.1: Firebase Deployment

**Goal:** Deploy app to Firebase Hosting and Functions
**Dependencies:** All features complete
**Estimated Effort:** 2-3 hours

**Subtasks:**

- [ ] 6.1.1 Build production frontend
  - Run: `npm run build` in frontend/
  - Verify build completes without errors
  - Check build size (target < 500KB gzipped)
  - Test build locally: `npm run preview`
- [ ] 6.1.2 Configure Firebase Hosting
  - Update `firebase.json` with hosting config
  - Set public directory to frontend/dist
  - Configure rewrites for SPA routing
  - Set up headers for caching
- [ ] 6.1.3 Set production environment variables
  - Frontend: Create production .env file
  - Backend: Set all Firebase function configs
  - OpenAI API key
  - Any other secrets
- [ ] 6.1.4 Deploy Cloud Functions
  - Run: `firebase deploy --only functions`
  - Verify all functions deployed successfully
  - Test endpoints with production URLs
  - Check logs for any errors
- [ ] 6.1.5 Deploy Firestore security rules
  - Review security rules for production
  - Run: `firebase deploy --only firestore:rules`
  - Test rules with Firebase emulator or manually
- [ ] 6.1.6 Deploy frontend to Hosting
  - Run: `firebase deploy --only hosting`
  - Verify deployment successful
  - Visit production URL
  - Test app functionality
- [ ] 6.1.7 Set up custom domain (optional)
  - Add custom domain in Firebase Console
  - Configure DNS records
  - Wait for SSL certificate provisioning
  - Test custom domain
- [ ] 6.1.8 Configure Firebase quotas and billing
  - Set billing alerts
  - Review quotas for Functions, Firestore
  - Set reasonable limits to avoid overages
- [ ] 6.1.9 Test production app thoroughly
  - Sign up new account
  - Send messages, test AI responses
  - Upload images, test OCR
  - Test all features in production
  - Check for any production-only issues
- [ ] 6.1.10 Set up monitoring
  - Enable Firebase Performance Monitoring
  - Enable Firebase Crashlytics (optional)
  - Set up error tracking (Sentry, optional)
  - Monitor function logs regularly

**Acceptance Criteria:**

- ✅ App deployed to Firebase Hosting
- ✅ Cloud Functions deployed and functional
- ✅ Production environment variables set
- ✅ Security rules deployed
- ✅ All features work in production
- ✅ Monitoring and alerts configured
- ✅ Production URL accessible
- ✅ SSL certificate active

---

### Task 6.2: Documentation - README

**Goal:** Create comprehensive README documentation
**Dependencies:** Task 6.1 (Deployment)
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 6.2.1 Create project overview section
  - Brief description of AI Math Tutor
  - Key features list
  - Link to live demo
  - Screenshot or GIF of app in action
- [ ] 6.2.2 Document technology stack
  - Frontend: React, Vite, Tailwind CSS, KaTeX
  - Backend: Firebase Functions, Node.js
  - Database: Firestore
  - AI: OpenAI GPT-4o-mini
  - Authentication: Firebase Auth
- [ ] 6.2.3 Write setup instructions
  - Prerequisites: Node.js, Firebase CLI
  - Clone repository
  - Install dependencies
  - Configure environment variables
  - Set up Firebase project
  - Run locally with emulators
  - Step-by-step with code blocks
- [ ] 6.2.4 Document environment variables
  - List all required variables
  - Explain where to get values (Firebase Console, OpenAI)
  - Template .env.example file
  - Note security considerations
- [ ] 6.2.5 Document deployment process
  - Build commands
  - Deployment commands
  - Post-deployment verification
  - Custom domain setup (optional)
- [ ] 6.2.6 Create usage guide
  - How to sign up/log in
  - How to ask math questions
  - How to upload images
  - How to use whiteboard (if implemented)
  - Tips for best results
- [ ] 6.2.7 Document project structure
  - Folder organization
  - Key files and their purposes
  - Component hierarchy
  - Service utilities
- [ ] 6.2.8 Add troubleshooting section
  - Common issues and solutions
  - Firebase errors
  - OpenAI API issues
  - Build/deployment problems
- [ ] 6.2.9 Include contributing guidelines
  - How to report bugs
  - How to request features
  - Code style guidelines
  - Pull request process
- [ ] 6.2.10 Add license and credits
  - Choose license (MIT recommended)
  - Credit libraries and resources used
  - Acknowledgments
  - Contact information

**Acceptance Criteria:**

- ✅ README is comprehensive and clear
- ✅ Setup instructions work for new developers
- ✅ All sections well-organized
- ✅ Code examples included where helpful
- ✅ Screenshots or GIFs included
- ✅ Links work correctly
- ✅ Professional presentation

---

### Task 6.3: Documentation - Example Walkthroughs

**Goal:** Document 5+ example problem walkthroughs
**Dependencies:** Task 6.2 (README)
**Estimated Effort:** 2-3 hours

**Subtasks:**

- [ ] 6.3.1 Create EXAMPLES.md file
  - Separate file for detailed examples
  - Link from README
- [ ] 6.3.2 Document Example 1: Simple Algebra
  - Problem: "Solve: 2x + 5 = 13"
  - Full conversation transcript
  - Show Socratic questioning
  - Screenshots at key steps
  - Final solution reached
- [ ] 6.3.3 Document Example 2: Geometry
  - Problem: "Find area of circle with radius 7cm"
  - Conversation flow
  - Show formula discovery
  - Math rendering examples
- [ ] 6.3.4 Document Example 3: Word Problem
  - Problem: "John has 3 apples, buys 5 more..."
  - Show problem decomposition
  - Variable identification
  - Solution process
- [ ] 6.3.5 Document Example 4: Multi-step Problem
  - Problem: "Simplify: 2(x + 3) + 4(x - 1)"
  - Show step-by-step guidance
  - Distribution and combining like terms
- [ ] 6.3.6 Document Example 5: Image Upload
  - Upload printed problem
  - OCR extraction
  - Confirmation/editing
  - Continued conversation
  - Screenshots of each step
- [ ] 6.3.7 Document Example 6: Whiteboard Use (if implemented)
  - Geometry problem requiring drawing
  - AI suggests whiteboard
  - Drawing process
  - Sharing with AI
  - AI analysis and response
- [ ] 6.3.8 Highlight Socratic method in examples
  - Annotate where AI asks questions vs gives hints
  - Show how AI never gives direct answers
  - Demonstrate adaptive difficulty
- [ ] 6.3.9 Include failure cases
  - What happens if student stuck
  - How AI provides hints
  - What if student asks for direct answer
- [ ] 6.3.10 Format examples clearly
  - Use markdown formatting
  - Color-code user vs AI messages
  - Add commentary explaining flow
  - Make easily scannable

**Acceptance Criteria:**

- ✅ 5+ diverse example walkthroughs
- ✅ Each example shows full conversation
- ✅ Socratic method clearly demonstrated
- ✅ Screenshots included
- ✅ Image upload example included
- ✅ Examples cover different problem types
- ✅ Well-formatted and readable

---

### Task 6.4: Documentation - Prompt Engineering Notes

**Goal:** Document system prompts and prompt engineering approach
**Dependencies:** Task 6.2 (README)
**Estimated Effort:** 2-3 hours

**Subtasks:**

- [ ] 6.4.1 Create PROMPTS.md file
  - Dedicated file for prompt documentation
  - Link from README
- [ ] 6.4.2 Document Socratic system prompt
  - Include full system prompt used
  - Explain each rule and why it's important
  - Show examples of good vs bad responses
- [ ] 6.4.3 Document OCR extraction prompt
  - Include OCR prompt template
  - Explain considerations for handwriting
  - Show example extractions
- [ ] 6.4.4 Document problem generation prompt
  - Include generation prompt
  - Explain similarity criteria
  - Show example inputs and outputs
- [ ] 6.4.5 Document whiteboard suggestion logic
  - Keywords that trigger suggestion
  - How AI decides when to suggest
  - Example messages with suggestions
- [ ] 6.4.6 Explain prompt engineering decisions
  - Why certain rules included
  - How to balance guidance vs answers
  - Token management strategy
  - Temperature and parameter choices
- [ ] 6.4.7 Document prompt testing process
  - How prompts were refined
  - Common failure modes encountered
  - Iterative improvements made
- [ ] 6.4.8 Include prompt optimization tips
  - How to improve Socratic responses
  - Handling edge cases
  - Adding new problem types
  - Adjusting difficulty levels
- [ ] 6.4.9 Document context window management
  - How conversation history is managed
  - Why 10-15 messages chosen
  - Including original problem
  - Future: Conversation summarization
- [ ] 6.4.10 Add prompt customization guide
  - How to modify system prompt
  - Testing changes safely
  - A/B testing approach
  - Monitoring prompt effectiveness

**Acceptance Criteria:**

- ✅ All prompts documented with explanations
- ✅ Prompt engineering rationale clear
- ✅ Examples of prompt effectiveness
- ✅ Optimization tips provided
- ✅ Context management explained
- ✅ Customization guide included
- ✅ Testing process documented

---

### Task 6.5: Demo Video Creation

**Goal:** Create 5-minute demo video showcasing features
**Dependencies:** All features complete, deployed
**Estimated Effort:** 3-4 hours

**Subtasks:**

- [ ] 6.5.1 Create video script
  - Outline: Intro → Features → Demo → Conclusion
  - Intro: What is AI Math Tutor, problem it solves (30s)
  - Feature overview: Socratic method, image upload, whiteboard (1min)
  - Demo: 3-4 example interactions (3min)
  - Conclusion: Call to action, GitHub link (30s)
- [ ] 6.5.2 Prepare demo scenarios
  - Scenario 1: Text input with algebra problem
  - Scenario 2: Image upload with OCR
  - Scenario 3: Geometry with whiteboard drawing
  - Scenario 4: Problem generation
  - Script each scenario with timing
- [ ] 6.5.3 Set up screen recording
  - Tool: OBS Studio, Loom, or QuickTime
  - Test audio quality (voiceover or music)
  - Set recording resolution: 1920x1080
  - Clean up browser (close tabs, bookmarks)
- [ ] 6.5.4 Record product walkthrough
  - Start with landing page
  - Sign up / log in
  - Navigate through interface
  - Demonstrate each feature
  - Show responsive design (optional)
- [ ] 6.5.5 Record demo scenarios
  - Scenario 1: Type "Solve 2x + 5 = 13"
  - Show AI's Socratic questioning
  - Reach solution naturally
  - Highlight key interactions
- [ ] 6.5.6 Record image upload demo
  - Upload photo of math problem
  - Show OCR extraction
  - Confirm/edit text
  - Continue with conversation
- [ ] 6.5.7 Record whiteboard demo (if implemented)
  - Open whiteboard panel
  - Draw geometric shape
  - Share with AI
  - Show AI's analysis and response
- [ ] 6.5.8 Edit video
  - Cut dead air and mistakes
  - Add transitions between sections
  - Add text overlays highlighting features
  - Background music (royalty-free)
  - Ensure 5-minute target length
- [ ] 6.5.9 Add captions and annotations
  - Subtitle key points
  - Arrow/circle important UI elements
  - Zoom in on text when relevant
  - Professional title cards
- [ ] 6.5.10 Export and upload video
  - Export in high quality (1080p, MP4)
  - Upload to YouTube/Vimeo
  - Add title: "AI Math Tutor - Socratic Learning Assistant Demo"
  - Write description with GitHub link
  - Add tags: AI, education, math tutor, Socratic method
  - Embed in README

**Acceptance Criteria:**

- ✅ 5-minute demo video complete
- ✅ Shows all core features clearly
- ✅ Professional quality (clear audio, smooth editing)
- ✅ Socratic method demonstrated
- ✅ Uploaded to video platform
- ✅ Linked from README
- ✅ Compelling and clear presentation

---

### Task 6.6: Final Testing & Bug Fixes

**Goal:** Comprehensive final testing and fix any remaining bugs
**Dependencies:** All previous tasks
**Estimated Effort:** 4-5 hours

**Subtasks:**

- [ ] 6.6.1 Run full regression test suite
  - Test all authentication flows
  - Test all chat features
  - Test image upload and OCR
  - Test whiteboard (if implemented)
  - Test voice features (if implemented)
  - Test problem generation (if implemented)
- [ ] 6.6.2 Test edge cases
  - Very long conversations (50+ messages)
  - Rapid message sending
  - Multiple concurrent users
  - Large images (near size limit)
  - Network interruptions
  - Browser back/forward rapidly
- [ ] 6.6.3 Test error recovery
  - Lose internet → Reconnect
  - API rate limit → Retry
  - Invalid image → Fallback
  - Firestore permission error → Handle
  - All error states show appropriate messages
- [ ] 6.6.4 Performance testing
  - Run Lighthouse on production
  - Test with slow 3G throttling
  - Check memory leaks (long session)
  - Monitor Firebase usage/costs
  - Verify no console errors/warnings
- [ ] 6.6.5 Cross-browser final check
  - Chrome, Firefox, Safari, Edge
  - Mobile: iOS Safari, Android Chrome
  - Verify all features functional
  - Note any browser-specific quirks
- [ ] 6.6.6 Accessibility final audit
  - Run axe DevTools audit
  - Test with screen reader
  - Verify keyboard navigation
  - Check color contrast
  - Fix any critical issues
- [ ] 6.6.7 Security audit
  - Review Firestore security rules
  - Check for exposed API keys
  - Verify authentication everywhere
  - Test unauthorized access attempts
  - Review CORS configuration
- [ ] 6.6.8 Create bug fix list
  - Document all bugs found
  - Prioritize: Critical, High, Medium, Low
  - Assign to fix immediately vs future
- [ ] 6.6.9 Fix critical and high-priority bugs
  - Address any blocking issues
  - Fix high-impact bugs
  - Test fixes thoroughly
  - Deploy fixes to production
- [ ] 6.6.10 Create known issues document
  - List any remaining bugs (low priority)
  - Document workarounds
  - Add to GitHub issues
  - Update README with known limitations

**Acceptance Criteria:**

- ✅ All critical bugs fixed
- ✅ Full regression test passed
- ✅ Edge cases handled appropriately
- ✅ Performance meets targets
- ✅ Cross-browser compatibility verified
- ✅ Accessibility audit passed
- ✅ Security review completed
- ✅ Known issues documented

---

## Appendix: Quick Reference

### Priority Labels

- **🔴 Critical**: Blocking issue, must fix immediately
- **🟠 High**: Important feature, needed for MVP
- **🟡 Medium**: Nice to have, improves UX
- **🟢 Low**: Enhancement, can defer

### Estimated Time Summary

- **Phase 1 (Foundation MVP)**: 22-27 hours
- **Phase 2 (Image Upload & OCR)**: 12-15 hours
- **Phase 3 (Conversation History)**: 9-12 hours
- **Phase 4 (UI/UX Polish & Testing)**: 18-23 hours
- **Phase 5 (Stretch Features)**: 21-28 hours
- **Phase 6 (Deployment & Docs)**: 16-21 hours

**Total Estimated Effort**: 98-126 hours (~2.5-3 weeks full-time)

### Task Tracking Tips

- Check off subtasks as you complete them
- Update estimates based on actual time spent
- Note blockers or issues in task comments
- Review completed tasks before moving to next phase
- Keep task list updated in version control

### Testing Checklist (Use Throughout)

- [ ] Feature works as expected
- [ ] Error handling implemented
- [ ] Loading states functional
- [ ] Responsive on mobile
- [ ] Accessible (keyboard, screen reader)
- [ ] No console errors
- [ ] Code reviewed and clean
- [ ] Documented (if needed)

### Deployment Checklist

- [ ] All environment variables set
- [ ] Production build successful
- [ ] Security rules deployed
- [ ] Functions deployed
- [ ] Frontend deployed
- [ ] Production tested
- [ ] Monitoring enabled
- [ ] Documentation updated

---
