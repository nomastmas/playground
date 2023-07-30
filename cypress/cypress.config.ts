import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    chromeWebSecurity: false,
    defaultCommandTimeout: 3000,
    supportFile: false,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  // Macbook 16"
  // NOTE: Feel free to edit this to best match your screen size!
  // viewportWidth: 1536,
  // viewportHeight: 960,

  // MBA 13"
  viewportWidth: 1470,
  viewportHeight: 956,
  // NOTE: Feel free to modify these values to take screenshots on failure or
  // videos of test runs. If you do, we recommend not committing these assets or
  // modifying the `.gitignore` to account for them.
  video: false,
  screenshotOnRunFailure: false,
});