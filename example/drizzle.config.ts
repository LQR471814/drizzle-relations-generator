import type { Config } from "drizzle-kit";

export default ({
  schema: "./index.ts",
  out: "./drizzle",
  driver: "better-sqlite",
} satisfies Config);
