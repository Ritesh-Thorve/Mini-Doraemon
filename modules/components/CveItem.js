import { escapeHtml } from './html.js';

export function CveItem(cve) {
    return `
        <article class="cve-item">
            <div class="cve-meta">
                <span class="cve-id">${escapeHtml(cve.cveId)}</span>
                <span>${escapeHtml(cve.severity)}</span>
                <span>${escapeHtml(cve.date)}</span>
            </div>
            <h2>${escapeHtml(cve.title)}</h2>
            <p class="cve-affected">${escapeHtml(cve.affectedProduct)}</p>
            <p>${escapeHtml(cve.description)}</p>
        </article>
    `;
}