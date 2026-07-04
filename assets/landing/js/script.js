// memoryblock.io — minimal landing page interactions.
//   1. Fetch the latest version from the `mblk` npm package
//   2. Wire the copy-to-clipboard button on the install command
// That's it. No feature cards, no scroll animations, no bloat.

document.addEventListener('DOMContentLoaded', () => {
    fetchLatestVersion();
    wireCopyButton();
});

async function fetchLatestVersion() {
    const el = document.getElementById('version-number');
    if (!el) return;
    try {
        const res = await fetch('https://registry.npmjs.org/memoryblock/latest', { cache: 'no-store' });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (data.version) el.textContent = data.version;
    } catch {
        // Silent — the hardcoded fallback in the HTML stays as-is.
    }
}

function wireCopyButton() {
    const btn = document.querySelector('.copy-btn');
    if (!btn) return;
    const targetId = btn.getAttribute('data-target');
    btn.addEventListener('click', async () => {
        const text = document.getElementById(targetId)?.textContent ?? '';
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Fallback for older browsers / non-secure contexts
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch { /* ignore */ }
            document.body.removeChild(ta);
        }
        // Visual feedback
        const original = btn.innerHTML;
        btn.classList.add('is-success');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('is-success');
        }, 1500);
    });
}