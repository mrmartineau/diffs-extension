# PR Elsewhere

Chrome and Firefox extension. Adds a **View in** menu next to the tabs on a GitHub pull request. It opens the same PR in another review tool.

- [Diffshub](https://diffshub.com)
- [pulls.review](https://pulls.review)
- [Graphite](https://graphite.dev)

## Keyboard

On a PR page, press `e` to open the menu. Then press the number shown next to a provider to go there.

`e` is used because GitHub and Refined GitHub already use most other single keys (`v` opens the review dialog).

## Add a provider

A provider is a site that can show any public GitHub PR from its owner, repo and number. Pull requests for new providers are welcome.

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

- Add the provider to the list at the top of this README.
- Add its name to `description` in `manifest.json`.

### 4. Test it

1. Load the extension in Chrome or Firefox (see [Run it](#run-it)).
2. Open a GitHub PR. Press `e`, then the provider's number. Make sure the provider shows the same PR.
3. Run `npx web-ext lint`. It must show 0 errors and 0 warnings.

## Run it

- **Chrome:** open `chrome://extensions`, turn on Developer mode, click **Load unpacked**, pick this folder.
- **Firefox:** `npx web-ext run`, or open `about:debugging#/runtime/this-firefox` and click **Load Temporary Add-on**, pick `manifest.json`.

Check for Firefox add-on store problems: `npx web-ext lint`.
