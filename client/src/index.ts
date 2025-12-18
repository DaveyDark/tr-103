import { serve } from "bun";
import index from "./index.html";

// Load config.json
let config: { apiUrl: string } = { apiUrl: "http://localhost:8000" };
try {
  const configFile = Bun.file("config.json");
  if (await configFile.exists()) {
    config = await configFile.json();
  }
} catch (error) {
  console.warn("Failed to load config.json, using defaults:", error);
}

const server = serve({
  routes: {
    // Serve config endpoint
    "/config.json": async () => {
      return Response.json(config);
    },
    
    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
