const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "dist/com.marlburrow.uptime-kuma.sdPlugin",
  publicPath: "./",
  pages: {
    plugin: "src/plugin.js",
    pi: "src/pi.js",
  },
});
