import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      solidPlugin({
        hot: false,
        solid: { generate: 'dom' },
      }),
    ],
    test: {
      watch: false,
      isolate: true,
      env: {
        NODE_ENV: 'production',
      },
      environment: 'jsdom',
      transformMode: { web: [/\.[jt]sx$/] },
      include: ['src/*.test.{ts,tsx}'],
    },
    resolve: {
      conditions: ['browser', 'development'],
      alias: [
        {
          find: /^monaco-editor$/,
          replacement: __dirname + '/node_modules/monaco-editor/esm/vs/editor/editor.api',
        },
      ],
    },
  }
})
