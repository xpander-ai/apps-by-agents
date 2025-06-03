const { defineConfig } = require('vite');
const path = require('path');

module.exports = defineConfig({
  root: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    open: '/'
  }
});