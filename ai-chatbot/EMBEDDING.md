# 🔗 Embedding Guide

Complete guide to embed your AI chatbot into existing websites and applications.

## 🎯 Embedding Options Overview

### 1. **iframe Embedding** (Easiest)
- Drop-in solution for any website
- No code changes to your existing site
- Works with WordPress, Squarespace, Wix, etc.

### 2. **Widget Integration** (Most Popular)
- Floating chat button
- Popup modal interface
- Customizable positioning and styling

### 3. **Component Integration** (For React Apps)
- Import as React component
- Full customization control
- Native integration

### 4. **API-Only Integration** (Most Flexible)
- Use just the chat API
- Build your own interface
- Maximum customization

---

## 🖼️ Method 1: iframe Embedding

### Basic iframe Embed
```html
<iframe 
  src="https://your-chatbot.vercel.app" 
  width="400" 
  height="600"
  frameborder="0"
  style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>
```

### Responsive iframe
```html
<div class="chatbot-container">
  <iframe 
    src="https://your-chatbot.vercel.app" 
    frameborder="0">
  </iframe>
</div>

<style>
.chatbot-container {
  position: relative;
  width: 100%;
  height: 600px;
  max-width: 400px;
  margin: 0 auto;
}

.chatbot-container iframe {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .chatbot-container {
    height: 500px;
    margin: 10px;
  }
}
</style>
```

### WordPress/CMS Integration
```html
<!-- Add to your page/post content -->
[raw]
<iframe 
  src="https://your-chatbot.vercel.app" 
  width="100%" 
  height="600"
  frameborder="0"
  style="max-width: 400px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</iframe>
[/raw]
```

---

## 💬 Method 2: Chat Widget Integration

### Floating Chat Button
Create a floating chat widget that opens your chatbot in a modal:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    .chat-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .chat-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }

    .chat-modal {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      z-index: 1001;
      display: none;
      overflow: hidden;
    }

    .chat-modal iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .chat-modal.open {
      display: block;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .chat-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Your existing website content -->

  <!-- Chat Widget -->
  <div class="chat-widget">
    <button class="chat-button" onclick="toggleChat()" id="chatButton">
      💬
    </button>
    <div class="chat-modal" id="chatModal">
      <iframe src="https://your-chatbot.vercel.app"></iframe>
    </div>
  </div>

  <script>
    let chatOpen = false;

    function toggleChat() {
      const modal = document.getElementById('chatModal');
      const button = document.getElementById('chatButton');
      
      if (chatOpen) {
        modal.classList.remove('open');
        button.innerHTML = '💬';
        chatOpen = false;
      } else {
        modal.classList.add('open');
        button.innerHTML = '✕';
        chatOpen = true;
      }
    }

    // Close chat when clicking outside
    document.addEventListener('click', function(event) {
      const widget = document.querySelector('.chat-widget');
      if (chatOpen && !widget.contains(event.target)) {
        toggleChat();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && chatOpen) {
        toggleChat();
      }
    });
  </script>
</body>
</html>
```

### Advanced Widget with Animation
```html
<div id="aiChatWidget"></div>

<script>
(function() {
  // Create widget HTML
  const widgetHTML = `
    <div id="chat-widget" style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 2147483647;
    ">
      <button id="chat-toggle" style="
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </button>
      
      <div id="chat-modal" style="
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 380px;
        height: 580px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        display: none;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(20px);
        opacity: 0;
      ">
        <iframe 
          src="https://your-chatbot.vercel.app" 
          style="width: 100%; height: 100%; border: none;"
          loading="lazy">
        </iframe>
      </div>
    </div>
  `;

  // Insert widget
  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  // Add functionality
  const toggle = document.getElementById('chat-toggle');
  const modal = document.getElementById('chat-modal');
  let isOpen = false;

  toggle.addEventListener('click', () => {
    if (isOpen) {
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.transform = 'translateY(20px)';
      toggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
    } else {
      modal.style.display = 'block';
      setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
      }, 10);
      toggle.innerHTML = '✕';
    }
    isOpen = !isOpen;
  });

  // Responsive behavior
  function handleResize() {
    if (window.innerWidth <= 768) {
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
        box-shadow: none;
        ${isOpen ? 'display: block; opacity: 1; transform: translateY(0);' : 'display: none;'}
      `;
    }
  }

  window.addEventListener('resize', handleResize);
  handleResize();
})();
</script>
```

---

## ⚛️ Method 3: React Component Integration

### Install as Component
First, extract the chatbot component for reuse:

```bash
# In your existing React app
npm install @your-username/ai-chatbot-component
```

### Custom React Component
```jsx
// components/AIChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import './AIChatbot.css';

const AIChatbot = ({ 
  apiEndpoint = 'https://your-chatbot.vercel.app/api/chat',
  theme = 'light',
  position = 'bottom-right',
  greeting = 'Hello! How can I help you today?'
}) => {
  const [messages, setMessages] = useState([
    { id: 1, content: greeting, role: 'assistant', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: data.message.content,
        role: 'assistant',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai-chatbot ${theme} ${position} ${isOpen ? 'open' : ''}`}>
      <button 
        className="chat-toggle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </button>
      
      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="chat-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.role}`}
              >
                <div className="message-content">
                  {message.content}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
```

### Using the Component
```jsx
// In your existing React app
import AIChatbot from './components/AIChatbot';

function App() {
  return (
    <div className="App">
      {/* Your existing app content */}
      
      <AIChatbot 
        apiEndpoint="https://your-chatbot.vercel.app/api/chat"
        theme="dark"
        position="bottom-left"
        greeting="Welcome! Ask me anything about our products."
      />
    </div>
  );
}
```

---

## 🔌 Method 4: API-Only Integration

### Direct API Usage
```javascript
// Custom chat implementation using just the API
class CustomChatbot {
  constructor(apiEndpoint, containerId) {
    this.apiEndpoint = apiEndpoint;
    this.container = document.getElementById(containerId);
    this.messages = [];
    this.init();
  }

  async sendMessage(message) {
    this.messages.push({ role: 'user', content: message });
    
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: this.messages })
    });

    const data = await response.json();
    this.messages.push({ 
      role: 'assistant', 
      content: data.message.content 
    });
    
    return data.message.content;
  }

  init() {
    // Build your custom interface here
    this.container.innerHTML = `
      <div class="custom-chat">
        <div id="messages"></div>
        <input type="text" id="messageInput" placeholder="Type here...">
        <button onclick="chatbot.handleSend()">Send</button>
      </div>
    `;
  }

  async handleSend() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    this.displayMessage('user', message);
    
    const response = await this.sendMessage(message);
    this.displayMessage('assistant', response);
  }

  displayMessage(role, content) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `
      <div class="message ${role}">
        <strong>${role}:</strong> ${content}
      </div>
    `;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

// Usage
const chatbot = new CustomChatbot(
  'https://your-chatbot.vercel.app/api/chat',
  'chatbot-container'
);
```

### Integration with Popular Frameworks

#### Next.js Integration
```jsx
// pages/chat.js
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, { role: 'user', content: message }] })
    });
    
    return await response.json();
  };

  return (
    <div>
      {/* Your chat interface */}
    </div>
  );
}
```

#### Vue.js Integration
```vue
<template>
  <div class="chatbot">
    <div class="messages">
      <div v-for="message in messages" :key="message.id" 
           :class="['message', message.role]">
        {{ message.content }}
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="inputMessage" placeholder="Type your message...">
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      inputMessage: ''
    };
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim()) return;

      const userMessage = { 
        role: 'user', 
        content: this.inputMessage,
        id: Date.now() 
      };
      
      this.messages.push(userMessage);
      this.inputMessage = '';

      const response = await fetch('https://your-chatbot.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: this.messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      this.messages.push({
        role: 'assistant',
        content: data.message.content,
        id: Date.now() + 1
      });
    }
  }
};
</script>
```

---

## 🎨 Customization Options

### Theme Customization
```css
/* Light theme */
.ai-chatbot.light {
  --bg-color: #ffffff;
  --text-color: #333333;
  --primary-color: #667eea;
  --border-color: #e1e5e9;
}

/* Dark theme */
.ai-chatbot.dark {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --primary-color: #764ba2;
  --border-color: #333333;
}

/* Brand colors */
.ai-chatbot.brand {
  --bg-color: #f8f9fa;
  --text-color: #495057;
  --primary-color: #your-brand-color;
  --border-color: #dee2e6;
}
```

### Position Options
```css
/* Bottom right (default) */
.ai-chatbot.bottom-right {
  bottom: 20px;
  right: 20px;
}

/* Bottom left */
.ai-chatbot.bottom-left {
  bottom: 20px;
  left: 20px;
}

/* Top right */
.ai-chatbot.top-right {
  top: 20px;
  right: 20px;
}

/* Center */
.ai-chatbot.center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

---

## 🔒 Security Considerations

### CORS Configuration
Make sure your chatbot allows requests from your domain:

```javascript
// In your chatbot's API
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-website.com", // Replace with your domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
```

### API Key Protection
Never expose API keys in client-side code:

```javascript
// ❌ Don't do this
const apiKey = 'sk-your-api-key-here'; // Visible to users

// ✅ Do this instead - API keys stay on server
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify(message)
});
```

---

## 📱 Mobile Optimization

### Responsive Widget
```css
@media (max-width: 768px) {
  .chat-modal {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 0 !important;
  }
}
```

### Touch-Friendly Design
```css
.chat-button {
  min-height: 44px; /* iOS minimum touch target */
  min-width: 44px;
  -webkit-tap-highlight-color: transparent;
}
```

---

## 🧪 Testing Your Integration

### Test Checklist
- [ ] Widget loads correctly
- [ ] Chat opens and closes smoothly
- [ ] Messages send and receive
- [ ] Responsive on mobile
- [ ] Works across browsers
- [ ] Doesn't conflict with existing CSS
- [ ] HTTPS works in production
- [ ] API calls succeed
- [ ] Error handling works

### Debug Common Issues
```javascript
// Add debug logging
console.log('Chat widget loaded');
console.log('API endpoint:', apiEndpoint);
console.log('Messages sent:', messages);

// Test API connection
fetch('https://your-chatbot.vercel.app/api/health')
  .then(r => r.json())
  .then(data => console.log('API health:', data));
```

---

## 🎉 You're All Set!

Choose the integration method that best fits your needs:

- **Quick & Easy**: Use iframe embedding
- **Professional**: Implement the floating widget
- **Custom**: Build with React/Vue components  
- **Advanced**: Use API-only integration

Your AI chatbot is now ready to enhance your website with intelligent conversations! 🚀