<script>
  import { DEFAULT_THEME } from '$lib/theme.js';

  let loading = $state(false);
  let error = $state(null);
  let themeName = $state(null);
  let promptText = $state('');
  let fontsLink = $state(null);
  let hasBeenUsed = $state(false);

  const activateSplitLayout = () => {
    const grid = document.querySelector('.resume-grid');
    if (!grid) return;
    grid.style.alignItems = 'stretch';
    for (const w of grid.querySelectorAll(':scope > main, :scope > aside')) {
      w.style.display = 'contents';
    }
    for (const s of grid.querySelectorAll('.grid-section')) {
      s.style.background = 'var(--color-surface)';
      s.style.borderRadius = 'var(--radius-xl)';
      s.style.padding = '24px';
      s.style.boxShadow = 'var(--shadow-sm)';
      s.style.border = '1px solid var(--color-card-border)';
      s.style.marginBottom = '0';
    }
  };

  const deactivateSplitLayout = () => {
    const grid = document.querySelector('.resume-grid');
    if (!grid) return;
    grid.style.alignItems = '';
    for (const w of grid.querySelectorAll(':scope > main, :scope > aside')) {
      w.style.display = '';
    }
    for (const s of grid.querySelectorAll('.grid-section')) {
      s.style.background = '';
      s.style.borderRadius = '';
      s.style.padding = '';
      s.style.boxShadow = '';
      s.style.border = '';
      s.style.marginBottom = '';
    }
  };

  const applyIcons = (icons) => {
    if (!icons || typeof icons !== 'object') return;
    removeIcons();
    for (const [area, iconName] of Object.entries(icons)) {
      if (!iconName) continue;
      const section = document.querySelector(`.grid-section[style*="grid-area: ${area}"]`);
      if (!section) continue;
      const title = section.querySelector('.section-title');
      if (!title) continue;
      const icon = document.createElement('iconify-icon');
      icon.setAttribute('icon', iconName);
      icon.setAttribute('width', '1.2em');
      icon.setAttribute('height', '1.2em');
      icon.style.verticalAlign = '-0.15em';
      icon.style.marginRight = '6px';
      icon.classList.add('theme-icon');
      title.insertBefore(icon, title.firstChild);
    }
  };

  const removeIcons = () => {
    for (const icon of document.querySelectorAll('.theme-icon')) {
      icon.remove();
    }
  };

  const isLightColor = (hex) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    const toLinear = (v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b) > 0.3;
  };

  const applyTheme = (vars) => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
    const bg = vars['--color-bg'];
    if (bg && /^#[0-9a-fA-F]{6}$/.test(bg)) {
      root.style.setProperty('--print-bg', isLightColor(bg) ? '#fff' : bg);
    }
    if (vars['--grid-template']) {
      activateSplitLayout();
    } else {
      deactivateSplitLayout();
    }
  };

  const resetTheme = () => {
    const root = document.documentElement;
    for (const key of Object.keys(DEFAULT_THEME)) {
      root.style.removeProperty(key);
    }
    if (fontsLink) {
      fontsLink.remove();
      fontsLink = null;
    }
    root.style.removeProperty('--grid-template');
    root.style.removeProperty('--print-bg');
    deactivateSplitLayout();
    removeIcons();
    themeName = null;
    error = null;
  };

  const loadFonts = (url) => {
    if (fontsLink) {
      fontsLink.remove();
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    fontsLink = link;
  };

  const spin = async (prompt = '') => {
    loading = true;
    error = null;
    hasBeenUsed = true;

    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }

      const theme = await res.json();

      if (theme.fonts_url) {
        loadFonts(theme.fonts_url);
      }

      applyTheme(theme.vars);
      applyIcons(theme.icons);
      themeName = theme.name || 'Custom Theme';
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    spin(promptText);
  };
</script>

<div class="roulette-panel" class:idle={!hasBeenUsed && !loading}>
  <div class="roulette-label">AI STYLE ROULETTE</div>
  <form class="roulette-form" onsubmit={handleSubmit}>
    <input
      type="text"
      class="roulette-input"
      placeholder="cyberpunk, zen garden..."
      bind:value={promptText}
      disabled={loading}
    />
    <button
      type="button"
      class="roulette-btn spin-btn"
      onclick={() => spin(promptText)}
      disabled={loading}
      title="Spin for a new style"
    >
      {#if loading}
        <span class="spinner"></span>
      {:else}
        <span class="dice">&#127922;</span>
      {/if}
    </button>
  </form>

  {#if themeName}
    <div class="roulette-status">
      <span class="theme-name">{themeName}</span>
      <button
        type="button"
        class="roulette-btn reset-btn"
        onclick={resetTheme}
        title="Reset to default"
      >
        &#8634;
      </button>
    </div>
  {/if}

  {#if error}
    <div class="roulette-error">{error}</div>
  {/if}
</div>

<style>
  .roulette-panel {
    position: fixed;
    top: 84px;
    right: var(--spacing-md, 1rem);
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;
    z-index: 50;
  }

  /* Breathing animation to attract attention before first use */
  .roulette-panel.idle {
    animation: breathe 3s ease-in-out infinite;
  }

  @keyframes breathe {
    0%, 100% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.04);
      filter: brightness(1.08);
    }
  }

  .roulette-label {
    font-family: "Audiowide", serif;
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--color-neutral-400, #a8a29e);
    text-align: right;
  }

  .roulette-form {
    display: flex;
    gap: 4px;
    align-items: center;
    background: var(--color-surface, #fff);
    border-radius: 15px;
    padding: 3px;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-card-border, rgba(0,0,0,0.06));
  }

  .roulette-input {
    width: 160px;
    padding: 6px 10px;
    border: 1px solid var(--color-divider, rgba(0,0,0,0.08));
    border-radius: 12px;
    font-size: 12px;
    background: var(--color-bg, #faf8f5);
    color: var(--color-text, #292524);
    outline: none;
    transition: border-color 0.2s;
  }

  .roulette-input:focus {
    border-color: var(--color-primary, #1e3a5f);
  }

  .roulette-input::placeholder {
    color: var(--color-neutral-400, #a8a29e);
    font-style: italic;
  }

  .roulette-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    padding: 0;
    flex-shrink: 0;
  }

  .roulette-btn:hover:not(:disabled) {
    transform: scale(1.1);
  }

  .roulette-btn:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .spin-btn {
    background: var(--color-primary, #1e3a5f);
    color: white;
    font-size: 18px;
    box-shadow: var(--shadow-sm);
  }

  .reset-btn {
    width: 24px;
    height: 24px;
    background: var(--color-neutral-200, #e7e5e4);
    color: var(--color-neutral-600, #57534e);
    font-size: 14px;
  }

  .dice {
    line-height: 1;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .roulette-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
  }

  .theme-name {
    color: var(--color-primary, #1e3a5f);
    font-weight: 600;
  }

  .roulette-error {
    background: #fef2f2;
    color: #dc2626;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: var(--radius-sm, 0.375rem);
  }

  @media (max-width: 768px) {
    .roulette-panel {
      display: none;
    }
  }

  @media print {
    .roulette-panel {
      display: none;
    }
  }
</style>
