import { dorkCategories, searchEngines } from './data.js';
import { renderDorkPage } from './view.js';

function normalizeDomain(input) {
    const value = input.trim();
    const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;

    try {
        const parsed = new URL(candidate);
        const hostname = parsed.hostname.toLowerCase();
        const validHostname = /^(?=.{1,253}$)(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)*[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.?$/i;
        if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || !validHostname.test(hostname)) {
            return null;
        }
        return hostname.replace(/\.$/, '');
    } catch {
        return null;
    }
}

function selectedValues(form, name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`), input => input.value);
}

function updateSelectionSummary(form) {
    const dorkCount = selectedValues(form, 'dork').length;
    const engineCount = selectedValues(form, 'engine').length;
    form.querySelector('#dork-count').textContent = `(${dorkCount} of ${dorkCategories.length} selected)`;
    form.querySelector('#launch-dork-btn').textContent = `Launch Dorks (${engineCount} engine${engineCount === 1 ? '' : 's'})`;
}

function buildSearchUrl(engine, query, domain) {
    const url = new URL(engine.baseUrl);
    url.searchParams.set(engine.queryParam, query.replaceAll('{domain}', domain));
    return url.toString();
}

function showBlockedResults(form, requests, blockedCount, domain) {
    const results = form.querySelector('#dork-results');
    const list = document.createElement('div');
    list.className = 'dork-results-links';
    for (const [index, request] of requests.entries()) {
        const link = document.createElement('a');
        link.href = request.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'dork-result-link';
        link.textContent = `${index + 1}. ${request.label}`;
        list.append(link);
    }

    const panel = document.createElement('div');
    panel.className = 'dork-results-panel';
    const header = document.createElement('div');
    header.className = 'dork-results-header';
    const heading = document.createElement('h3');
    heading.textContent = `Browser blocked ${blockedCount} tab${blockedCount === 1 ? '' : 's'}`;
    const description = document.createElement('p');
    description.textContent = `Some searches for ${domain} did not open. Allow pop-ups for this site or open the links below manually.`;
    header.append(heading, description);
    panel.append(header, list);
    results.replaceChildren(panel);
    results.style.display = 'block';
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function mountDorkLauncher(root) {
    root.innerHTML = renderDorkPage(dorkCategories, searchEngines);

    const form = root.querySelector('#dork-form');

    updateSelectionSummary(form);

    form.addEventListener('change', event => {
        if (event.target.matches('input[name="dork"]')) {
            event.target.closest('.dork-card').classList.toggle('selected', event.target.checked);
        }
        if (event.target.matches('input[name="dork"], input[name="engine"]')) {
            updateSelectionSummary(form);
        }
    });

    form.addEventListener('click', event => {
        const button = event.target.closest('[data-action]');
        if (!button) return;

        const shouldSelect = button.dataset.action === 'select-all';
        for (const checkbox of form.querySelectorAll('input[name="dork"]')) {
            checkbox.checked = shouldSelect;
            checkbox.closest('.dork-card').classList.toggle('selected', shouldSelect);
        }
        updateSelectionSummary(form);
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const domain = normalizeDomain(form.querySelector('#dork-domain').value);
        const selectedEngines = selectedValues(form, 'engine');
        const selectedDorks = selectedValues(form, 'dork');
        const results = form.querySelector('#dork-results');
        results.style.display = 'none';

        if (!domain) {
            alert('Please enter a valid domain name, such as example.com.');
            return;
        }
        if (selectedEngines.length === 0) {
            alert('Please select at least one search engine.');
            return;
        }
        if (selectedDorks.length === 0) {
            alert('Please select at least one dork category.');
            return;
        }

        const categories = dorkCategories.filter(category => selectedDorks.includes(category.id));
        const engines = searchEngines.filter(engine => selectedEngines.includes(engine.key));
        const requests = [];

        for (const engine of engines) {
            for (const category of categories) {
                const queries = Array.isArray(category.query) ? category.query : [category.query];
                for (const query of queries) {
                    const processedQuery = query.replaceAll('{domain}', domain);
                    requests.push({
                        url: buildSearchUrl(engine, processedQuery, domain),
                        label: `${engine.name} · ${category.id} — ${processedQuery}`
                    });
                }
            }
        }

        let blockedCount = 0;
        const batchId = Date.now();
        for (const [index, request] of requests.entries()) {
            const openedWindow = window.open(request.url, `dork-search-${batchId}-${index}`);
            if (!openedWindow || openedWindow.closed) blockedCount += 1;
        }

        if (blockedCount > 0) {
            showBlockedResults(form, requests, blockedCount, domain);
        }
    });
}