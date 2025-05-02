'use server';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

interface MLRequest {
  input: string;
  model: string;
}

interface MLPrediction {
  prediction: string;
  confidence: number;
}

interface MLResponse {
  result: MLPrediction;
  processingTime: number;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse the request body
    const body = JSON.parse(event.body || '{}') as MLRequest;
    
    // Validate input
    if (!body.input || !body.model) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields: input and model'
        })
      };
    }

    // Start processing timer
    const startTime = Date.now();

    // Process ML request
    const result = await processMLRequest();

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Return successful response
    return {
      statusCode: 200,
      body: JSON.stringify({
        result,
        processingTime
      } as MLResponse)
    };
  } catch (error) {
    console.error('Error processing ML request:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

async function processMLRequest(): Promise<MLPrediction> {
  // Implement your ML processing logic here
  // This is a placeholder that returns a mock result
  return {
    prediction: 'mock result',
    confidence: 0.95
  };
} 