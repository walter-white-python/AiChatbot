// AI Chatbot API - Handles chat requests with LLM integration
// This runs on Cloudflare Workers at the edge

// Types for chat functionality
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

interface ChatResponse {
  message: ChatMessage;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// LLM Provider configurations
interface LLMProvider {
  name: string;
  apiUrl: string;
  headers: (apiKey: string) => HeadersInit;
  formatRequest: (request: ChatRequest) => any;
  parseResponse: (response: any) => ChatMessage;
}

// OpenAI provider configuration
const openaiProvider: LLMProvider = {
  name: 'openai',
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  headers: (apiKey: string) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }),
  formatRequest: (request: ChatRequest) => ({
    model: request.model || 'gpt-3.5-turbo',
    messages: request.messages,
    temperature: request.temperature || 0.7,
    max_tokens: request.max_tokens || 1000,
  }),
  parseResponse: (response: any) => ({
    role: 'assistant',
    content: response.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.',
  }),
};

// Anthropic provider configuration
const anthropicProvider: LLMProvider = {
  name: 'anthropic',
  apiUrl: 'https://api.anthropic.com/v1/messages',
  headers: (apiKey: string) => ({
    'x-api-key': apiKey,
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
  }),
  formatRequest: (request: ChatRequest) => ({
    model: request.model || 'claude-3-haiku-20240307',
    max_tokens: request.max_tokens || 1000,
    temperature: request.temperature || 0.7,
    messages: request.messages.filter(m => m.role !== 'system'),
    system: request.messages.find(m => m.role === 'system')?.content,
  }),
  parseResponse: (response: any) => ({
    role: 'assistant',
    content: response.content[0]?.text || 'Sorry, I couldn\'t generate a response.',
  }),
};

// Fallback responses when no API key is configured
const fallbackResponses = [
  "I'm a demo AI assistant! To enable real AI responses, configure an API key for OpenAI, Anthropic, or another LLM provider in your environment variables.",
  "Thanks for trying out this chatbot! This is a simulated response. To get real AI responses, add your API credentials to the backend configuration.",
  "Hello! I'm currently running in demo mode. For full functionality, please configure an LLM API key (OpenAI, Anthropic, etc.) in your deployment settings.",
  "This is a sample response from the demo chatbot. To unlock real AI conversations, set up your preferred LLM provider's API key in the environment variables.",
  "Great question! I'm operating in demonstration mode right now. To enable actual AI responses, configure your LLM API credentials in the backend.",
];

const getFallbackResponse = (userMessage: string): ChatMessage => {
  // Add some variety based on the user's message
  const responses = [...fallbackResponses];
  
  if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
    responses.unshift("Hello! I'm running in demo mode. To enable real AI conversations, configure an LLM API key in your environment settings.");
  } else if (userMessage.toLowerCase().includes('help')) {
    responses.unshift("I'd love to help! Currently, I'm running in demo mode. For full AI capabilities, please set up an API key for OpenAI, Anthropic, or another LLM provider.");
  } else if (userMessage.toLowerCase().includes('api') || userMessage.toLowerCase().includes('key')) {
    responses.unshift("To enable real AI responses, add an API key to your environment variables: OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY.");
  }
  
  return {
    role: 'assistant',
    content: responses[Math.floor(Math.random() * responses.length)]
  };
};

// Helper function to call LLM API
async function callLLM(provider: LLMProvider, apiKey: string, request: ChatRequest): Promise<ChatMessage> {
  try {
    const response = await fetch(provider.apiUrl, {
      method: 'POST',
      headers: provider.headers(apiKey),
      body: JSON.stringify(provider.formatRequest(request)),
    });
    
    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return provider.parseResponse(data);
  } catch (error) {
    console.error(`Error calling ${provider.name} API:`, error);
    throw error;
  }
}

// Helper function for CORS headers
function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}

// Main worker handler
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const origin = request.headers.get("Origin") || "*";
    
    // Handle CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }
    
    // Router - match paths and methods
    try {
      // GET /api/health - Health check endpoint
      if (url.pathname === "/api/health" && method === "GET") {
        const hasOpenAI = !!process.env.OPENAI_API_KEY;
        const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
        const hasGemini = !!process.env.GEMINI_API_KEY;
        
        return Response.json(
          { 
            status: "healthy", 
            timestamp: new Date().toISOString(),
            version: "1.0.0",
            llm_providers: {
              openai: hasOpenAI,
              anthropic: hasAnthropic,
              gemini: hasGemini,
              demo_mode: !hasOpenAI && !hasAnthropic && !hasGemini
            }
          },
          { headers: corsHeaders(origin) }
        );
      }
      
      // POST /api/chat - Main chat endpoint
      if (url.pathname === "/api/chat" && method === "POST") {
        try {
          const chatRequest = await request.json() as ChatRequest;
          
          // Validate request
          if (!chatRequest.messages || !Array.isArray(chatRequest.messages) || chatRequest.messages.length === 0) {
            return Response.json(
              { error: "Messages array is required and cannot be empty" },
              { status: 400, headers: corsHeaders(origin) }
            );
          }
          
          // Check for API keys and determine provider
          const openaiKey = process.env.OPENAI_API_KEY;
          const anthropicKey = process.env.ANTHROPIC_API_KEY;
          
          let responseMessage: ChatMessage;
          
          if (openaiKey) {
            try {
              responseMessage = await callLLM(openaiProvider, openaiKey, chatRequest);
            } catch (error) {
              console.error('OpenAI API error:', error);
              responseMessage = getFallbackResponse(chatRequest.messages[chatRequest.messages.length - 1]?.content || '');
            }
          } else if (anthropicKey) {
            try {
              responseMessage = await callLLM(anthropicProvider, anthropicKey, chatRequest);
            } catch (error) {
              console.error('Anthropic API error:', error);
              responseMessage = getFallbackResponse(chatRequest.messages[chatRequest.messages.length - 1]?.content || '');
            }
          } else {
            // No API keys configured - return demo response
            const userMessage = chatRequest.messages[chatRequest.messages.length - 1]?.content || '';
            responseMessage = getFallbackResponse(userMessage);
          }
          
          const response: ChatResponse = {
            message: responseMessage,
            // usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 } // Would be filled by real LLM APIs
          };
          
          return Response.json(response, { headers: corsHeaders(origin) });
          
        } catch (error) {
          console.error('Chat endpoint error:', error);
          return Response.json(
            { error: "Failed to process chat request" },
            { status: 500, headers: corsHeaders(origin) }
          );
        }
      }
      
      // GET /api/models - List available models
      if (url.pathname === "/api/models" && method === "GET") {
        const models: Array<{ id: string; provider: string; name: string }> = [];
        
        if (process.env.OPENAI_API_KEY) {
          models.push(
            { id: 'gpt-3.5-turbo', provider: 'openai', name: 'GPT-3.5 Turbo' },
            { id: 'gpt-4', provider: 'openai', name: 'GPT-4' },
            { id: 'gpt-4-turbo', provider: 'openai', name: 'GPT-4 Turbo' }
          );
        }
        
        if (process.env.ANTHROPIC_API_KEY) {
          models.push(
            { id: 'claude-3-haiku-20240307', provider: 'anthropic', name: 'Claude 3 Haiku' },
            { id: 'claude-3-sonnet-20240229', provider: 'anthropic', name: 'Claude 3 Sonnet' },
            { id: 'claude-3-opus-20240229', provider: 'anthropic', name: 'Claude 3 Opus' }
          );
        }
        
        if (models.length === 0) {
          models.push({ id: 'demo', provider: 'demo', name: 'Demo Mode (Configure API keys to unlock real AI)' });
        }
        
        return Response.json({ models }, { headers: corsHeaders(origin) });
      }
      
      // 404 for unmatched routes
      return Response.json(
        { error: "Not Found", path: url.pathname },
        { status: 404, headers: corsHeaders(origin) }
      );
      
    } catch (error) {
      console.error("API Error:", error);
      return Response.json(
        { error: "Internal Server Error" },
        { status: 500, headers: corsHeaders(origin) }
      );
    }
  }
};

// Environment bindings interface for type safety
interface Env {
  OPENAI_API_KEY?: string;       // OpenAI API key
  ANTHROPIC_API_KEY?: string;    // Anthropic API key
  GEMINI_API_KEY?: string;       // Google Gemini API key
  // DB: D1Database;             // For SQL database (if needed)
  // KV: KVNamespace;            // For key-value storage (if needed)
} 