import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  STRIPE_SECRET_KEY: z.string(),
  AWS_LAMBDA_ENDPOINT: z.string().url().optional(),
});

export const config = envSchema.parse(process.env);

export const isProduction = config.NODE_ENV === "production";
export const baseUrl = isProduction ? config.API_GATEWAY_URL : config.NEXT_PUBLIC_APP_URL; 