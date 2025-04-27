import OpenAI from 'openai';

// Check for environment variables during initialization
const apiKey = process.env.OPENAI_API_KEY;

// Create a function that gets the OpenAI client
export function getOpenAIClient() {
  if (!apiKey) {
    console.warn("OpenAI API key not found. AI features will be disabled.");
    return null;
  }
  
  return new OpenAI({ apiKey });
}

// Use this in place of direct client instantiation
// This defers the error until the client is actually used
export async function getCompletion(prompt: string) {
  const openai = getOpenAIClient();
  
  if (!openai) {
    throw new Error("OpenAI client is not configured. AI features are disabled.");
  }
  
  return openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
} 