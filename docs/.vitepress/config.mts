import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Tiny Games",
  description: "The portable games console.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Download", link: "/download" },
      { text: "Quick Start", link: "/quick-start" }
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Download", link: "/download" },
          { text: "Quick Start", link: "/quick-start" },
        ]
      },
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
    }
  }
});
