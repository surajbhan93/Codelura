import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/flowbite-react/**/*.js"
  ],
  plugins: [require("flowbite/plugin")]
};
export default config;
