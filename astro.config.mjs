import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"

import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  // i18n: {
  //   defaultLocale: "pl",
  //   locales: ["en", "pl"]
  // },
  // https://docs.astro.build/en/recipes/i18n/
  projectRoot: "./src",
  integrations: [tailwind(), react()]
})
