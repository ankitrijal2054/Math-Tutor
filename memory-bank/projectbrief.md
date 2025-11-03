# AI Math Tutor - Project Brief

## Project Name

AI Math Tutor - Socratic Learning Assistant

## Problem Statement

Traditional tutoring gives students answers, not understanding. Students need guided practice that builds critical thinking and mathematical intuition through discovery rather than memorization.

## Solution

A web-based conversational AI tutor that teaches mathematics through Socratic questioning. Students input problems (text or image), and the AI guides them through step-by-step reasoning using leading questions, hints, and validation—never giving direct answers.

## Target Users

- **Primary:** Middle school through early college students seeking math help
- **Secondary:** Educators and researchers studying AI-assisted learning

## Core Value Proposition

- Promotes deep conceptual understanding through guided discovery
- Provides unlimited, patient tutoring available 24/7
- Adapts questioning based on student responses and comprehension level

## Platform

Responsive web application for desktop and mobile browsers

## Success Criteria

Successfully guides students through diverse problem types (arithmetic, algebra, geometry, word problems, multi-step) without giving direct answers while maintaining conversation context and adapting to understanding level.

## Tech Stack

- **Frontend:** React 18+ (Vite, Tailwind CSS, Functional Components + Hooks)
- **Backend:** Firebase Cloud Functions (Node.js 18+)
- **Database:** Firestore (NoSQL)
- **Authentication:** Firebase Auth (Email/Password + Google Sign-In)
- **Storage:** Firebase Storage
- **AI:** OpenAI GPT-4o-mini (chat + vision for OCR)
- **Math Rendering:** KaTeX
- **Hosting:** Firebase Hosting
- **State Management:** React Context API + custom hooks

## MVP Scope

Phases 1-4:

1. Authentication system (email/password + Google)
2. Text-based chat with Socratic AI responses
3. Image upload with OCR text extraction (Firebase Storage)
4. Math equation rendering (KaTeX)
5. Conversation persistence (Firestore)
6. Responsive UI with proper error handling

## Stretch Features (Post-MVP)

- Interactive whiteboard (side-panel on desktop, full-screen on mobile)
- Voice interface (speech-to-text + text-to-speech)
- Problem generation (create practice problems from solved problems)

## Team & Timeline

- **Team:** Solo developer (Ankit)
- **Timeline:** No hard deadline - quality over speed
- **GitHub:** User will set up separately

## Project Workspace

`/Users/ankit/Desktop/GauntletAI/Math Tutor`
