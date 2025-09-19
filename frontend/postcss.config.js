// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {}, // Use the new plugin
    autoprefixer: {}, // Keep this plugin for browser compatibility
  },
};
