import type { Analysis, CalculatorType } from '@/types/analysis';

const PROMPT_TEMPLATES: Record<CalculatorType, string> = {
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
Format the response in clear, concise bullet points.`,

  renters: `As a buy-and-hold investment expert, analyze this renters property data and provide insights:
Inputs:
{inputs}
Results:
{results}
Please provide:
1. Monthly income potential
2. Long-term equity growth
3. Risk and tenant turnover analysis
4. Tax/finance implications
5. Suggestions to improve yield
Format the response in clear, concise bullet points.`
};

export function generateInsightPrompt<T extends CalculatorType>(analysis: Analysis<T>): string {
  const template = PROMPT_TEMPLATES[analysis.type];

  if (!template) {
    throw new Error(`No prompt template defined for calculator type: ${analysis.type}`);
  }

  // Use optional chaining to avoid undefined crashes
  const inputs = JSON.stringify((analysis.data as any)?.inputs || {}, null, 2);
  const results = JSON.stringify(analysis.data || {}, null, 2);

  return template
    .replace('{inputs}', inputs)
    .replace('{results}', results);
}
