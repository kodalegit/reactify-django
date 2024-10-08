import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enable global testing functions (describe, it, etc.)
    environment: "node",
    coverage: {
      provider: "istanbul",
    },
  },
});
