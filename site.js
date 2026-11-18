// Progressive enhancements & Baseline fallbacks for Goza Games

// 1. Invoker Commands polyfill (command / commandfor) — loaded conditionally only when missing
if (!('commandForElement' in HTMLButtonElement.prototype)) {
  import(new URL('./vendor/invokers-polyfill.js', import.meta.url));
}

// 2. Two-state system-aware color-scheme toggle (per dark-mode-toggle guide)
const schemeMeta = document.querySelector('meta[name="color-scheme"]');
const themeButton = document.querySelector('[data-theme-toggle]');

function getSystemScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getRenderedScheme() {
  const current = schemeMeta?.getAttribute('content');
  if (current === 'dark' || current === 'light') return current;
  return getSystemScheme();
}

function applyScheme(value) {
  if (!schemeMeta) return;
  schemeMeta.setAttribute('content', value || 'light dark');
}

themeButton?.addEventListener('click', () => {
  const target = getRenderedScheme() === 'dark' ? 'light' : 'dark';
  const system = getSystemScheme();

  if (target !== system) {
    try {
      localStorage.setItem('color-scheme', target);
    } catch {}
    applyScheme(target);
  } else {
    try {
      localStorage.removeItem('color-scheme');
    } catch {}
    applyScheme('light dark');
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === 'color-scheme') {
    const val = event.newValue;
    applyScheme(val === 'light' || val === 'dark' ? val : 'light dark');
  }
});

// Directional Cross-Document View Transitions (per cross-document-transitions guide)
function getPathDepth(urlString) {
  try {
    const pathname = new URL(urlString).pathname.replace(/\/index\.html$/, '/');
    return pathname.split('/').filter(Boolean).length;
  } catch {
    return 0;
  }
}

if ('onpagereveal' in window) {
  window.addEventListener('pagereveal', (event) => {
    if (event.viewTransition && window.navigation?.activation?.from) {
      const fromDepth = getPathDepth(window.navigation.activation.from.url);
      const toDepth = getPathDepth(window.navigation.activation.entry.url);
      if (toDepth > fromDepth) {
        event.viewTransition.types.add('drill-down');
      } else if (toDepth < fromDepth) {
        event.viewTransition.types.add('return-hub');
      }
    }
  });
}

// 3. Top-layer discrete display/overlay exit fallback + <dialog closedby="any"> fallback
let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return Boolean(window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay());
}

async function closeTopLayer(dialog) {
  if (!dialog.open) return;
  if (!supportsTopLayerExit()) {
    dialog.setAttribute('data-closing', '');
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    }
    if (!dialog.hasAttribute('data-closing')) return;
    dialog.removeAttribute('data-closing');
  }
  dialog.close();
  dialog.returnValue = '';
}

const supportsClosedBy = 'closedBy' in HTMLDialogElement.prototype;

for (const dialog of document.querySelectorAll('dialog.lightbox')) {
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeTopLayer(dialog);
  });

  dialog.addEventListener('close', () => {
    dialog.returnValue = '';
  });

  // Coordinate-bounds light-dismiss fallback for browsers without <dialog closedby="any">
  if (!supportsClosedBy && dialog.getAttribute('closedby') === 'any') {
    const isOutside = (e) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = isOutside(e);
    });
    dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && isOutside(e)) {
        closeTopLayer(dialog);
      }
    });
  }
}

// 4. Native CSS scrollspy aria-current sync + IntersectionObserver fallback (per scrollspy guide)
for (const spyNav of document.querySelectorAll('[data-scrollspy]')) {
  const links = Array.from(spyNav.querySelectorAll('a[href^="#"]'));
  const targets = links
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (targets.length === 0) continue;

  if (window.CSS?.supports?.('scroll-target-group: auto')) {
    const syncAriaCurrent = () => {
      const currentLink = spyNav.querySelector('a:target-current');
      for (const link of links) {
        if (link === currentLink) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      }
    };
    syncAriaCurrent();
    document.addEventListener('scrollend', syncAriaCurrent, { passive: true });
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const activeHref = `#${entry.target.id}`;
            for (const link of links) {
              const isActive = link.getAttribute('href') === activeHref;
              link.classList.toggle('target-current', isActive);
              if (isActive) {
                link.setAttribute('aria-current', 'true');
              } else {
                link.removeAttribute('aria-current');
              }
            }
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );
    for (const target of targets) observer.observe(target);
  }
}
