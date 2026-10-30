# PR Elsewhere

Chrome and Firefox extension. Adds a **View in** menu next to the tabs on a GitHub pull request. It opens the same PR in another review tool.

- [Diffshub](https://diffshub.com)
- [pulls.review](https://pulls.review)
- [Graphite](https://graphite.dev)

## Keyboard

On a PR page, press `e` to open the menu. Then press the number shown next to a provider to go there.

`e` is used because GitHub and Refined GitHub already use most other single keys (`v` opens the review dialog).

## Run it

- **Chrome:** open `chrome://extensions`, turn on Developer mode, click **Load unpacked**, pick this folder.
- **Firefox:** `npx web-ext run`, or open `about:debugging#/runtime/this-firefox` and click **Load Temporary Add-on**, pick `manifest.json`.

## Contributing

Want to add a provider or fix something? See [CONTRIBUTING.md](CONTRIBUTING.md).
