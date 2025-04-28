import type { Analysis } from '@/lib/data';

const PROMPT_TEMPLATES = {
  rental: `As a real estate investment expert, analyze this rental property data and provide insights:
Inputs:
{inputs}
Results:
{results}
Please provide:
1. Key strengths and opportunities
2. Potential risks and concerns
3. ROI context and market comparison
4. Specific improvement recommendations
5. Long-term investment outlook
Format the response in clear, concise bullet points.`,

  airbnb: `As a short-term rental expert, analyze this Airbnb property data and provide insights:
Inputs:
{inputs}
Results:
{results}
Please provide:
1. Market positioning and demand analysis
2. Revenue optimization opportunities
3. Risk factors and mitigation strategies
4. Seasonal performance insights
5. Property improvement recommendations
Format the response in clear, concise bullet points.`,

  wholesale: `As a real estate wholesaling expert, analyze this deal data and provide insights:
Inputs:
{inputs}
Results:
{results}
Please provide:
1. Deal attractiveness assessment
2. Potential buyer profiles
3. Market timing considerations
4. Risk factors and mitigation
5. Exit strategy recommendations
Format the response in clear, concise bullet points.`,

  mortgage: `As a mortgage and financing expert, analyze this loan data and provide insights:
Inputs:
{inputs}
Results:
{results}
Please provide:
1. Loan structure analysis
2. Interest rate context
3. Refinancing opportunities
4. Risk assessment
5. Alternative financing options
Format the response in clear, concise bullet points.`
};

export function generateInsightPrompt(analysis: Analysis): string {
  const template = PROMPT_TEMPLATES[analysis.type] || PROMPT_TEMPLATES.rental;
  
  return template
    .replace('{inputs}', JSON.stringify(analysis.inputs, null, 2))
    .replace('{results}', JSON.stringify(analysis.results, null, 2));
}