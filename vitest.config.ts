import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'


export default defineConfig({
  plugins: [tsconfigPaths()],
    
  test: {
     globals: true,
     include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
     setupFiles: ['src/test/']
  },
})