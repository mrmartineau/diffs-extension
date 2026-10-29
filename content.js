// Add a "View in" menu to GitHub pull request pages.
// Press `e` (elsewhere) to open it, then a number key to pick a provider.

const PROVIDERS = [
  {
    name: 'Diffshub',
    url: ({ owner, repo, number }) =>
      `https://diffshub.com/${owner}/${repo}/pull/${number}`,
  },
  {
    name: 'pulls.review',
    url: ({ owner, repo, number }) =>
      `https://pulls.review/gh/${owner}/${repo}/${number}`,
  },
  {
    name: 'Graphite',
    url: ({ owner, repo, number }) =>
      `https://app.graphite.dev/github/pr/${owner}/${repo}/${number}`,
  },
]

const ID = 'pr-elsewhere'
const MENU_ID = `${ID}-menu`
// GitHub and Refined GitHub already use most letters (`v` opens the review dialog); `e` is free
const HOTKEY = 'e'
// The flex row that holds the Conversation / Commits / Checks / Files changed tabs
const TABS_SELECTOR = 'nav[aria-label="Pull request navigation"] > div'

// Octicon paths: link-external and triangle-down
const ICON_EXTERNAL =
  'M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z'
const ICON_CARET =
  'm4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z'

const icon = (d) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  for (const [k, v] of Object.entries({
    class: 'octicon',
    viewBox: '0 0 16 16',
    width: 16,
    height: 16,
    fill: 'currentColor',
    'aria-hidden': true,
  }))
    svg.setAttribute(k, v)
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  svg.append(path)
  return svg
}

const parsePr = (path) => {
  const m = path.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)(?:\/|$)/)
  return m && { owner: m[1], repo: m[2], number: m[3] }
}

// Links are built when the menu opens, so they follow client-side navigation between PRs
const fillMenu = (menu) => {
  const pr = parsePr(location.pathname)
  if (!pr) return
  menu.replaceChildren(
    ...PROVIDERS.map((provider, i) => {
      const link = document.createElement('a')
      link.className = 'pr-elsewhere-item'
      link.href = provider.url(pr)
      const kbd = document.createElement('kbd')
      kbd.textContent = i + 1
      link.append(provider.name, kbd)
      return link
    }),
  )
}

const closeMenu = () => {
  const menu = document.getElementById(MENU_ID)
  if (menu?.matches(':popover-open')) menu.hidePopover()
}

const createButton = () => {
  const wrapper = document.createElement('div')
  wrapper.id = ID

  const menu = document.createElement('div')
  menu.id = MENU_ID
  menu.className = 'pr-elsewhere-menu'
  menu.popover = 'auto'

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'pr-elsewhere-button'
  button.popoverTargetElement = menu
  // GitHub's own hotkey system clicks this button; it already skips text fields
  button.dataset.hotkey = HOTKEY
  button.setAttribute('aria-keyshortcuts', HOTKEY)
  const label = document.createElement('span')
  label.textContent = 'View in'
  button.append(icon(ICON_EXTERNAL), label, icon(ICON_CARET))

  wrapper.append(button, menu)
  menu.addEventListener('beforetoggle', (e) => {
    if (e.newState !== 'open') return
    fillMenu(menu)
    // ponytail: fixed position set on open and closed on scroll; use CSS anchor positioning once Firefox ships it
    const rect = button.getBoundingClientRect()
    menu.style.top = `${rect.bottom + 4}px`
    menu.style.left = `${rect.left}px`
    addEventListener('scroll', closeMenu, { passive: true, once: true })
  })
  menu.addEventListener('toggle', (e) => {
    if (e.newState === 'open') menu.querySelector('a')?.focus()
  })
  // Focus is inside the menu while it is open, so number keys pick a provider
  menu.addEventListener('keydown', (e) => {
    const link = menu.children[Number(e.key) - 1]
    if (link && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault()
      link.click()
    }
  })
  return wrapper
}

const ensureButton = () => {
  if (document.getElementById(ID) || !parsePr(location.pathname)) return
  document.querySelector(TABS_SELECTOR)?.append(createButton())
}

// GitHub swaps the page without a full load, so watch the DOM and re-add the button when it goes
let queued = false
new MutationObserver(() => {
  if (queued) return
  queued = true
  requestAnimationFrame(() => {
    queued = false
    ensureButton()
  })
}).observe(document.body, { childList: true, subtree: true })
ensureButton()
