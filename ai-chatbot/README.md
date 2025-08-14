# AI Chatbot 🤖

A modern, full-featured AI chatbot interface similar to ChatGPT, built with React, TypeScript, and Tailwind CSS. Features real-time chat, LLM integration, dark/light themes, and persistent conversation history.

## ✨ Features

- **🎨 Modern UI**: Clean, responsive interface with smooth animations
- **🤖 AI Integration**: Support for multiple LLM providers (OpenAI, Anthropic, Google Gemini)
- **💬 Real-time Chat**: Instant messaging with typing indicators
- **🌓 Theme Toggle**: Dark and light mode support with system preference detection
- **💾 Persistence**: Conversation history saved in localStorage
- **⌨️ Keyboard Shortcuts**: Press Enter to send, Shift+Enter for new line
- **🔄 Auto-scroll**: Automatically scrolls to newest messages
- **🎪 Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Fast**: Built with Vite for lightning-fast development and builds

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Start Development Server

```bash
bun dev
```

Visit `http://localhost:5173` to see your chatbot in action!

**The chatbot works immediately in demo mode** - try sending messages to see intelligent demo responses. When you're ready for real AI, continue to step 3.

### 3. Configure LLM Provider (Optional)

For real AI responses, set up one or more API keys:

#### Option A: Environment File (Recommended)
Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```env
# Choose one or more providers
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

#### Option B: Direct Environment Variables
```bash
export OPENAI_API_KEY="your-openai-api-key-here"
# or
export ANTHROPIC_API_KEY="your-anthropic-api-key-here"
```

#### API Key Sources:
- **OpenAI**: Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Anthropic**: Get your key from [Anthropic Console](https://console.anthropic.com/account/keys)

### 4. Restart Server (if using API keys)

```bash
# Stop current server (Ctrl+C) and restart
bun dev
```

**Note**: The chatbot automatically detects API keys and switches from demo mode to real AI responses!

## 🔧 Configuration

### LLM Providers

The chatbot supports multiple LLM providers with automatic fallback:

1. **OpenAI** (GPT-3.5, GPT-4, GPT-4 Turbo)
2. **Anthropic** (Claude 3 Haiku, Sonnet, Opus)
3. **Google Gemini** (Coming soon)

Priority order: OpenAI → Anthropic → Demo Mode

### Environment Variables

Create a `.env` file in your project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic Configuration  
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google Gemini Configuration (Future)
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🏗️ Architecture

### Frontend (`src/App.tsx`)
- **React 19** with TypeScript
- **TailwindCSS V4** for styling
- **ShadCN UI** components
- **Lucide** icons
- **Message persistence** via localStorage
- **Theme management** with system preference detection

### Backend (`src/backend/api.ts`)
- **Cloudflare Workers** compatible
- **Multiple LLM provider** support
- **CORS** handling
- **Error recovery** and fallbacks
- **Health check** endpoint

### Key Components

- `ChatMessage`: Individual message display with avatars and timestamps
- `TypingIndicator`: Animated dots while AI is responding
- `ChatInput`: Message input with keyboard shortcuts
- `ThemeToggle`: Dark/light mode switching

## 📡 API Endpoints

### `POST /api/chat`
Send messages to the AI and get responses.

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Response:**
```json
{
  "message": {
    "role": "assistant", 
    "content": "Hello! I'm doing well, thank you for asking. How can I help you today?"
  }
}
```

### `GET /api/health`
Check system status and available LLM providers.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0",
  "llm_providers": {
    "openai": true,
    "anthropic": false,
    "gemini": false,
    "demo_mode": false
  }
}
```

### `GET /api/models`
List available AI models.

**Response:**
```json
{
  "models": [
    {
      "id": "gpt-3.5-turbo",
      "provider": "openai", 
      "name": "GPT-3.5 Turbo"
    }
  ]
}
```

## 🎨 Customization

### Themes
Modify colors in `src/index.css`:

```css
:root {
  --primary: oklch(0.6 0.2 270);  /* Purple accent */
  --background: oklch(1 0 0);     /* White background */
  --foreground: oklch(0.145 0 0); /* Dark text */
}
```

### Models
Update supported models in `src/backend/api.ts`:

```typescript
const models = [
  { id: 'gpt-4', provider: 'openai', name: 'GPT-4' },
  { id: 'claude-3-opus', provider: 'anthropic', name: 'Claude 3 Opus' }
];
```

### UI Components
All UI components are in `src/components/ui/` and can be customized using ShadCN CLI:

```bash
bunx shadcn@latest add button
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
bun build
# Deploy the dist/ folder to Vercel
```

### Netlify
```bash
bun build
# Deploy the dist/ folder to Netlify
```

### Cloudflare Pages
```bash
bun build
# Deploy the dist/ folder to Cloudflare Pages
# The API worker will run on Cloudflare Workers
```

## 🛠️ Development

### Commands

```bash
# Development server
bun dev

# Type checking
bun run tsc

# Build for production  
bun build

# Preview production build
bun preview

# Lint code
bun run lint
```

### Project Structure

```
src/
├── App.tsx                 # Main chatbot component
├── index.css              # Global styles and theme
├── main.tsx              # React app entry point
├── backend/
│   └── api.ts            # Cloudflare Worker API
├── components/ui/        # ShadCN UI components
├── hooks/               # Custom React hooks
└── lib/
    └── utils.ts         # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋 Support

Having issues? Check out:

- **Demo Mode**: Works without API keys for testing
- **Health Check**: Visit `/api/health` to check system status  
- **Console Logs**: Open browser DevTools for debugging info
- **API Errors**: Check if your API keys are valid and have sufficient credits

---

Built with ❤️ using [Scout](https://scout.new) - The AI-powered development platform.