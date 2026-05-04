import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tailwindcss(),
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
  };
});
