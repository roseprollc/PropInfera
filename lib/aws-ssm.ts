import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssm = new SSMClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export async function getParameter(name: string): Promise<string> {
  try {
    const { Parameter } = await ssm.send(
      new GetParameterCommand({
        Name: name,
        WithDecryption: true,
      })
    );
    return Parameter?.Value || "";
  } catch (error) {
    console.error(`Error fetching parameter ${name}:`, error);
    return "";
  }
}

export async function getStripeKey(): Promise<string> {
  return getParameter("/prod/PropInfera/StripeKey");
}

export async function getWebhookSecret(): Promise<string> {
  return getParameter("/prod/PropInfera/StripeWebhookSecret");
} 