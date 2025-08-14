# Setup Guide 🚀

This guide walks you through setting up your AI chatbot with different LLM providers.

## Getting API Keys

### OpenAI (Recommended)

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys) 
4. Click "Create new secret key"
5. Copy your key (starts with `sk-`)

**Models Available:**
- `gpt-3.5-turbo` - Fast, affordable
- `gpt-4` - More capable, slower
- `gpt-4-turbo` - Latest GPT-4 model

**Pricing:** Pay per token (~$0.002/1K tokens for GPT-3.5)

### Anthropic (Claude)

1. Visit [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to [API Keys](https://console.anthropic.com/account/keys)
4. Click "Create Key"
5. Copy your key

**Models Available:**
- `claude-3-haiku-20240307` - Fast, economical
- `claude-3-sonnet-20240229` - Balanced performance
- `claude-3-opus-20240229` - Most capable

**Pricing:** Pay per token (~$0.25/1M input tokens for Haiku)

### Google Gemini (Coming Soon)

1. Visit [Google AI Studio](https://makersuite.google.com)
2. Get your API key
3. Configure in environment variables

## Environment Setup

### Local Development

Create a `.env` file in your project root:

```bash
# Choose one or more providers
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
GEMINI_API_KEY=your-gemini-key-here
```

### Deployment Platforms

#### Vercel
1. Go to your project settings
2. Add Environment Variables:
   - `OPENAI_API_KEY`: `your-key-here`

#### Netlify  
1. Go to Site settings → Build & deploy → Environment
2. Add variables:
   - `OPENAI_API_KEY`: `your-key-here`

#### Cloudflare Pages
1. Go to Settings → Environment variables
2. Add production variables:
   - `OPENAI_API_KEY`: `your-key-here`

## Testing Your Setup

### Check API Connection

Visit `/api/health` in your browser to see:

```json
{
  "status": "healthy",
  "llm_providers": {
    "openai": true,     ← API key detected
    "anthropic": false, ← No API key
    "demo_mode": false  ← Real AI enabled
  }
}
```

### Test Chat

1. Open the chatbot
2. Send a message
3. You should get a real AI response (not demo text)

## Troubleshooting

### Demo Mode Messages

If you see messages like "Configure API keys to unlock real AI":
- ✅ Check your `.env` file exists
- ✅ Restart your development server
- ✅ Verify API key format (starts with `sk-` for OpenAI)

### API Errors

**"Insufficient quota"**
- Your API credits have run out
- Add billing information to your provider account

**"Invalid API key"**  
- Check for typos in your key
- Ensure no extra spaces or quotes
- Regenerate key if needed

**"Rate limit exceeded"**
- You're sending too many requests
- Wait a moment and try again
- Upgrade your API plan if needed

### Network Issues

**"Failed to fetch"**
- Check your internet connection
- Try refreshing the page
- Check if the API service is down

## Cost Management

### OpenAI Tips
- Use `gpt-3.5-turbo` for testing (much cheaper)
- Set usage limits in OpenAI dashboard
- Monitor usage in the platform

### Anthropic Tips  
- Claude 3 Haiku is the most economical
- Set up billing alerts
- Use shorter conversations to reduce costs

## Security Best Practices

### API Key Safety
- ✅ Never commit API keys to git
- ✅ Use environment variables only
- ✅ Regenerate keys if accidentally exposed  
- ✅ Set usage limits on provider platforms

### Production Setup
- Use separate API keys for development/production
- Enable API key restrictions where available
- Monitor usage and set up alerts
- Rotate keys regularly

## Advanced Configuration

### Custom Models

Edit `src/backend/api.ts` to add new models:

```typescript
if (process.env.OPENAI_API_KEY) {
  models.push(
    { id: 'gpt-4-turbo-preview', provider: 'openai', name: 'GPT-4 Turbo Preview' }
  );
}
```

### Request Parameters

Modify default settings in the API calls:

```typescript
formatRequest: (request: ChatRequest) => ({
  model: request.model || 'gpt-3.5-turbo',
  messages: request.messages,
  temperature: 0.7,        // ← Creativity (0-2)
  max_tokens: 1000,        // ← Response length
  presence_penalty: 0,     // ← Avoid repetition
  frequency_penalty: 0     // ← Avoid frequency bias
})
```

### Provider Priority

Change the order providers are tried:

```typescript
// Try Anthropic first, then OpenAI
const anthropicKey = process.env.ANTHROPIC_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (anthropicKey) {
  // Use Claude
} else if (openaiKey) {
  // Use OpenAI
}
```

## Need Help?

- 📧 Check the console for error messages
- 🌐 Visit provider documentation
- 🔧 Test with `/api/health` endpoint
- 💬 The chatbot shows helpful demo messages when misconfigured

Happy chatting! 🎉