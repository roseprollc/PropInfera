import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:3000"),
  API_GATEWAY_URL: z.string().url().default("https://api.propinfera.com"),
  STRIPE_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);

export const isProduction = env.NODE_ENV === "production";
export const baseUrl = isProduction ? env.API_GATEWAY_URL : env.NEXT_PUBLIC_API_BASE_URL; 