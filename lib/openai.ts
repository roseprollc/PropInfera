import OpenAI from 'openai';

// Function to get the OpenAI client
export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn("OpenAI API key not found. AI features will be disabled.");
    return null;
  }
  
  return new OpenAI({ apiKey });
}

// Helper function to check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Wrapper function for completions that handles missing API key
export async function getCompletion(prompt: string) {
  const openai = getOpenAIClient();
  
  if (!openai) {
    throw new Error("OpenAI client is not configured. AI features are disabled.");
  }
  
  return openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });
} 