import { escapeHtml } from './html.js';

export function DorkControls(categories, engines) {
    const engineControls = engines.map((engine, index) => `
        <label class="engine-label">
            <input type="checkbox" name="engine" value="${escapeHtml(engine.key)}" ${index === 0 ? 'checked' : ''}>
            ${escapeHtml(engine.name)}
        </label>
    `).join('');

    const categoryCards = categories.map(category => `
        <label class="dork-card" data-category="${escapeHtml(category.id)}">
            <div class="dork-card-header">
                <input type="checkbox" name="dork" value="${escapeHtml(category.id)}">
                <h4>${escapeHtml(category.id)}</h4>
            </div>
            <p>${escapeHtml(category.description)}</p>
        </label>
    `).join('');

    return { engineControls, categoryCards };
}