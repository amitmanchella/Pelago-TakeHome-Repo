# Voiced Sandbox

A local web-based sandbox for prototyping Voiced-like conversational AI features. Built with Next.js, OpenAI, and localStorage. Features a liquid glass (glassmorphism) UI with customizable animated backgrounds.

## Features

- **Streaming Chat** - Real-time AI responses that appear word-by-word as they're generated (like watching someone type)
- **Working Memory** - Automatically extracts and remembers facts, preferences, and topics across conversations
- **End-of-Conversation Screen** - AI-generated reflection with validation, themes, key moments, and encouragement
- **Conversation Starters** - Optional prompts to kickstart new chats
- **Customizable Themes** - 4 animated backgrounds (Waves, Clouds, Particles, Aurora), 5 color palettes, 3 glass intensity levels
- **System Prompt Editor** - Customize the AI's personality and boundaries with prompt injection protection
- **localStorage Persistence** - No database needed, all data stored locally in your browser

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up your OpenAI API key**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your OPENAI_API_KEY
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## How It Works

### Streaming Responses
Instead of waiting for the complete response, the AI sends text in small chunks as it generates them. You see the response appear in real-time, word-by-word, creating a more natural and responsive conversational experience.

### Working Memory
- When you click "Done", the AI analyzes the conversation and extracts key information
- Facts, preferences, and topics are automatically saved to localStorage
- In future conversations, the AI references this memory only when naturally relevant
- Click "Clear All" to reset everything

### End-of-Conversation
- Click "Done" to end a conversation
- AI generates a personalized reflection including validation, themes, key moments, and encouragement
- Customize the analysis style in Settings (warm & supportive, gentle & reflective, etc.)
- Memory is automatically extracted and saved

### Customization
**Settings → Theme:**
- Background: Waves, Clouds, Particles, Aurora, or None
- Color Palette: Cool Blue, Warm Sunset, Forest Green, Lavender, Ocean Deep
- Glass Intensity: Light, Medium, or Heavy

**Settings → Analysis Style:**
Choose the emotional tone for end-of-conversation screens

**Settings → System Prompt:**
Edit the AI's personality and boundaries. Default includes protection against off-topic requests.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4o-mini)
- localStorage

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts                # Streaming chat endpoint
│   │   ├── analyze-conversation/route.ts # End screen generation
│   │   └── extract-memory/route.ts      # Memory extraction
│   ├── page.tsx              # Main chat interface
│   └── globals.css           # Glass UI styles
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── storage.ts            # localStorage + default system prompt
│   └── theme.ts              # Theme configuration
├── components/
│   ├── EndOfConversationScreen.tsx
│   └── backgrounds/          # Aurora, Clouds, Particles, Waves
```

## Design

**Glassmorphism UI:**
- Frosted glass effect with backdrop blur
- Optimized text contrast for readability
- Smooth transitions and GPU-accelerated animations

**Animated Backgrounds:**
- All backgrounds use CSS animations optimized for performance
- Change backgrounds instantly without page reload

## Notes

- All data stored in browser localStorage (no backend/database)
- API key stays secure via server-side API routes
- Memory is referenced intelligently - no forced connections
- System prompt prevents prompt injection attacks
