import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("${process.env.NEXT_PUBLIC_API_URL}"),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  AWS_LAMBDA_ENDPOINT: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_GATEWAY_URL: z.string().url().optional(),
});

export const config = envSchema.parse(process.env);
export const isProduction = config.NODE_ENV === "production";
export const baseUrl = isProduction ? config.API_GATEWAY_URL : config.NEXT_PUBLIC_APP_URL;