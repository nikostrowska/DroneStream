import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";


// https://vite.dev/config/
export default defineConfig( ({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
    ],
    server: {
      port: 4000,
      strictPort: true,
      host: true,
      proxy: {
        "/api": {
          target: `http://${env.BACKEND_HOSTNAME}:4001`,
          secure: false,
        },
      },
    },
  }
});
