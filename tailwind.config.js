module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./src/app/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
      "./src/components/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    // DaisyUI removed — using Tailwind utility classes and local UI primitives
    // Theme/styles are based on Tailwind color tokens (emerald primary)
  }