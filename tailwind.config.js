module.exports = {
  content: ["./public/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
        text: { DEFAULT: "#F2F2F7", 2: "#C8C8D0", 3: "#B4B4BC" },
        tg: "#7ED4FF",
        max: "#CDBEFF",
        ok: "#3DDC84",
        warn: "#FF8F70",
        ink: "#12141C"
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
