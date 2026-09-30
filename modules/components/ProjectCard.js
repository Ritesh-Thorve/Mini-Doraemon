import { escapeHtml, safeHref } from './html.js';

export function ProjectCard(project, index) {
    const href = safeHref(project.href);
    const originHref = safeHref(project.originUrl);
    const isExternal = href.startsWith('http');
    const linkAttributes = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const capabilities = Array.isArray(project.capabilities) ? project.capabilities : [];
    const capabilityList = capabilities.map(capability => `<li>${escapeHtml(capability)}</li>`).join('');
    const action = href
        ? `<a class="project-link" href="${escapeHtml(href)}"${linkAttributes}>${escapeHtml(project.actionLabel || 'View project')} <span aria-hidden="true">&rarr;</span></a>`
        : '';
    const originLink = originHref.startsWith('http')
        ? `<a class="project-origin-link" href="${escapeHtml(originHref)}" target="_blank" rel="noopener noreferrer">View project origin <span aria-hidden="true">&nearr;</span></a>`
        : '';

    return `
        <article class="project-item">
            <div class="project-meta">
                <span class="project-number">${String(index + 1).padStart(2, '0')}</span>
                <span class="project-type">${escapeHtml(project.category)}</span>
            </div>
            <h2>${escapeHtml(project.title)}</h2>
            <p>${escapeHtml(project.description)}</p>
            <ul class="project-tags" aria-label="Capabilities">${capabilityList}</ul>
            <div class="project-actions">${action}${originLink}</div>
        </article>
    `;
}