import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src', '!src/**/*.spec.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
})