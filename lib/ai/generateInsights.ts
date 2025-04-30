import OpenAI from 'openai';
import type { Analysis, CalculatorType } from '@/types/analysis';

const openaiApiKey = process.env.OPENAI_API_KEY || '';

const openai = openaiApiKey
  ? new OpenAI({ apiKey: openaiApiKey })
  : null;

export async function generateInsights<T extends CalculatorType>(analysis: Analysis<T>): Promise<string> {
  if (!openai) {
    return 'OpenAI API key is not set. Please provide a valid API key.';
  }

  try {
    const prompt = `Analyze the following real estate investment analysis and provide key insights:

Investment Type: ${analysis.type}
Title: ${analysis.title}

Results:
${Object.entries(analysis.data || {})
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Please provide:
1. Key strengths of this investment
2. Potential risks or concerns
3. Recommendations for improvement
4. Market context and comparison
5. Long-term outlook

Format the response in clear, concise bullet points.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a real estate investment expert providing detailed analysis and insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0]?.message?.content || 'Unable to generate insights at this time.';
  } catch (error) {
    console.error('Error generating insights:', error);
    return 'An error occurred while generating insights. Please try again later.';
  }
}
