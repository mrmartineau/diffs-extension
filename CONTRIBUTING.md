# Contributing

Thank you for helping. The most common change is a new provider, so that comes first.

The extension has no build step and no dependencies. The files in this folder are the extension:

| File | What it does |
|---|---|
| `manifest.json` | Extension settings for Chrome and Firefox |
| `content.js` | Adds the menu to GitHub PR pages. The `PROVIDERS` list is at the top |
| `content.css` | Menu styles. They use GitHub's own CSS variables, so light and dark themes match |
| `icons/` | `icon.svg` is the source. The PNG files are made from it |
| `web-ext-config.mjs` | Which files go in the store zip |

## Run it locally

- **Chrome:** open `chrome://extensions`, turn on Developer mode, click **Load unpacked**, pick this folder. After a change, click the reload button on the extension card.
- **Firefox:** run `npx web-ext run`. It reloads when you save a file.

## Add a provider

A provider is a site that can show any public GitHub PR from its owner, repo and number.

### 1. Find the URL format

Open one PR in the provider and copy its URL. Find which parts are the owner, the repo and the PR number. For `github.com/mrmartineau/zander.wtf/pull/9`:

| Provider | URL |
|---|---|
| Diffshub | `https://diffshub.com/mrmartineau/zander.wtf/pull/9` |
| pulls.review | `https://pulls.review/gh/mrmartineau/zander.wtf/9` |

Check the format against a real source: the provider's docs, a link the provider made, or its route list. A single-page app returns `200` for any path, so a working `curl` does not prove the format.

### 2. Add it to `PROVIDERS`

Add an object to the `PROVIDERS` array at the top of `content.js`:

```js
{
  name: 'Example',
  url: ({ owner, repo, number }) =>
    `https://example.com/${owner}/${repo}/pull/${number}`,
},
```

- `name` is the text in the menu.
- `url` gets the PR parts from the current GitHub URL and returns the link. `number` is a string.
- The order in the array is the order in the menu. The first item gets key `1`, the second gets `2`, and so on.
- Only the first 9 providers get a number key. Keep the list at 9 or fewer.

No other change is needed. The menu is built from this array each time it opens.

### 3. Update the docs

- Add the provider to the list at the top of `README.md`.
- Add its name to `description` in `manifest.json`.

### 4. Test it

1. Load the extension (see [Run it locally](#run-it-locally)).
2. Open a GitHub PR. Press `e`, then the provider's number. Make sure the provider shows the same PR.
3. Run `npx web-ext lint`. It must show 0 errors and 0 warnings.

## Rules for code changes

- Do not add a build step or a dependency unless there is no other way.
- Do not use `innerHTML`. Firefox's add-on review flags it. Build elements with `createElement`.
- Do not add your own key listener for the menu key. The button uses GitHub's `data-hotkey`, so GitHub handles the key and skips text fields.
- Test in Chrome and Firefox if you change `content.js` or `content.css`.

## Change the icon

Edit `icons/icon.svg`, then make the PNG files again. You need `rsvg-convert` and ImageMagick (`brew install librsvg imagemagick`):

```sh
for s in 16 32 48; do rsvg-convert -w $s -h $s icons/icon.svg -o icons/icon-$s.png; done
# Chrome Web Store: 128px icon = 96px artwork + 16px clear padding on each side
rsvg-convert -w 96 -h 96 icons/icon.svg | magick - -background none -gravity center -extent 128x128 icons/icon-128.png
```

## Release to the stores

One zip works for the Chrome Web Store, Firefox Add-ons and Microsoft Edge Add-ons.

1. Raise `version` in `manifest.json`. Each store refuses a version it already has.
2. Run `npx web-ext lint`. It must show 0 errors and 0 warnings.
3. Run `npx web-ext build`. This makes `dist/pr_elsewhere-<version>.zip`. Settings are in `web-ext-config.mjs`.
4. Upload the zip:
   - **Chrome:** [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole)
   - **Firefox:** [Firefox Add-ons developer hub](https://addons.mozilla.org/developers/addon/submit/distribution). The code has no build step, so do not upload source code when asked.
   - **Edge:** [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview)

Chrome shows a warning about the `browser_specific_settings` key. Firefox needs that key, and Chrome ignores it, so you can ignore the warning.

## Send a pull request

1. Fork the repo and make a branch.
2. Make your change and test it.
3. Open a pull request. Say which browsers you tested in.
