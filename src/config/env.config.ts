type NodeEnv = "development" | "qa" | "production";
export const ENV = {
  NODE_ENV: process.env.NODE_ENV as NodeEnv,

  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN!,
};