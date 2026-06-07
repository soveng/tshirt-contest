import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const DEFAULT_SITE_URL = "https://tshirt-contest.vercel.app";

function siteMetaPlugin(siteUrl: string) {
  const normalized = siteUrl.replace(/\/$/, "");

  return {
    name: "site-meta",
    transformIndexHtml(html: string) {
      return html.replaceAll("%VITE_SITE_URL%", normalized);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = env.VITE_SITE_URL || DEFAULT_SITE_URL;

  return {
    plugins: [react(), siteMetaPlugin(siteUrl)],
  };
});
