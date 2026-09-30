function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

export function renderDorkPage(categories, engines) {
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

    return `
        <div class="launcher-container dork-launcher fade-in">
            <div class="launcher-header">
                <h1>Search Engine Dork Launcher</h1>
                <p>This tool helps security researchers, bug bounty hunters, and penetration testers quickly run dorks against a target domain using Google, Bing, DuckDuckGo, and Yandex to discover sensitive endpoints, exposed files, and potential vulnerabilities.</p>
            </div>

            <form id="dork-form" class="form-group">
                <input type="text" id="dork-domain" class="input-field" placeholder="Enter domain (e.g. example.com)" required>

                <div class="engine-toggles" style="margin-top: 1rem;">
                    <span>Search Engines:</span>
                    ${engineControls}
                </div>

                <div class="dork-controls">
                    <button type="button" class="control-btn" data-action="select-all">Select All</button>
                    <button type="button" class="control-btn" data-action="clear">Deselect All</button>
                    <span class="selection-count" id="dork-count" aria-live="polite"></span>
                </div>

                <div class="dork-grid-container">
                    <div class="dork-grid" id="dork-grid">
                        ${categoryCards}
                    </div>
                </div>

                <div style="margin-top: 1rem;">
                    <button type="submit" class="btn-primary" id="launch-dork-btn">Launch Dorks (1 engine)</button>
                </div>

                <div id="dork-results" style="display: none;"></div>
            </form>

            <div class="launcher-notes">
                <ul>
                    <li>Sensitive files - Config files, logs, backups, environment files</li>
                    <li>API endpoints - REST APIs, Swagger docs, versioned endpoints</li>
                    <li>Vulnerability Indicators - XSS, SQLi, SSRF, LFI, RCE parameters</li>
                    <li>Error pages - Stack traces, database errors, exceptions</li>
                    <li>Authentication pages - Login forms, admin panels</li>
                    <li>Cloud storage leaks - S3 buckets, Azure blobs, Google Cloud Storage</li>
                    <li>Code leaks - Pastebin, JSFiddle, CodePen</li>
                    <li>Third-party references - OpenBugBounty, Google Groups</li>
                    <li>CMS-specific paths - Adobe Experience Manager endpoints</li>
                </ul>
                <p>Note: Your browser may block pop-ups the first time you use this tool. You'll need to allow pop-ups for this site for the tool to work properly.<br>
                Search engines may rate-limit or show CAPTCHAs if too many searches are launched at once.<br>
                Consider deselecting some categories or search engines if you encounter issues.</p>
            </div>
        </div>
    `;
}