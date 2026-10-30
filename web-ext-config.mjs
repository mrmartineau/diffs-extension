// Settings for `npx web-ext build`: the store zip holds only the files the extension runs
export default {
  artifactsDir: 'dist',
  ignoreFiles: ['README.md', 'CONTRIBUTING.md', 'icons/icon.svg', 'web-ext-config.mjs'],
  build: { overwriteDest: true },
}
