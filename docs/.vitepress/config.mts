import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Tiny Games",
  description: "The portable games console.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Quick Start", link: "/quick-start" }
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Download", link: "/#getting-started" },
          { text: "Quick Start", link: "/quick-start" },
        ]
      },
      {
        text: "API Reference",
        items: [
          { text: "Configuration", link: "/reference/game-json" },
          { text: "App API", link: "/reference/app-api" },
          { text: "Web API", link: "/reference/web-api" }
        ]
      }
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/C0mplexity0/tiny-games" }
    ],

    editLink: {
      pattern: "https://github.com/C0mplexity0/tiny-games/edit/main/docs/:path",
      text: "Edit this page"
    },

    footer: {
      message: "Released under the GPL-3.0 License."
    },

    search: {
      provider: "local"
    },

    externalLinkIcon: true
  },
  lastUpdated: true,
  base: "/tiny-games/"
});
