export function ReconPage() {
    return `
        <div class="launcher-container fade-in">
            <div class="launcher-header">
                <h1>Recon Launcher</h1>
                <p>This tool is a target reconnaissance launcher designed to assist security researchers, bug bounty hunters, and penetration testers in quickly gathering publicly available intelligence about a target domain.</p>
            </div>
            <form id="recon-form" class="form-group">
                <input type="text" id="recon-domain" class="input-field" placeholder="Enter domain (e.g. example.com)" required>
                <div style="margin-top: 1rem;">
                    <button type="submit" class="btn-primary">Launch Recon</button>
                </div>
                <p id="recon-status" role="status" aria-live="polite"></p>
            </form>
            <div class="launcher-notes">
                <h3>What this tool does</h3>
                <p>When you enter a domain and click Launch Recon, this tool will open multiple tabs with searches across various platforms:</p>
                <ul>
                    <li>Google site search (more on dork tool)</li>
                    <li>GitHub domain search</li>
                    <li>Wayback Machine (historical snapshots)</li>
                    <li>Shodan (exposed services)</li>
                    <li>SecurityTrails (DNS history and subdomains)</li>
                    <li>Censys (certificates and infrastructure)</li>
                    <li>crt.sh (certificates)</li>
                    <li>IntelX (OSINT search engine)</li>
                    <li>AlienVault OTX (threat intelligence)</li>
                    <li>Hunter.how (search for exposed services and vulnerabilities)</li>
                    <li>Phonebook.cz (passive DNS data)</li>
                    <li>urlscan.io (domain-level scans and links)</li>
                    <li>FOFA (open source threat intelligence)</li>
                    <li>Favicon Hash (hash lookup to detect reused icons across services)</li>
                    <li>VirusTotal (domain reputation and security checks)</li>
                    <li>ChatGPT (search for any interesting, suspicious, or security-related information)</li>
                    <li>LeakIX (search for leaks related to the domain)</li>
                    <li>ZoomEye (search for exposed services and vulnerabilities)</li>
                    <li>Docker Hub (search for Docker images related to the domain)</li>
                    <li>GitLab (search for repositories related to the domain)</li>
                    <li>Postman (search for APIs related to the domain)</li>
                    <li>Hugging Face (search for machine learning models related to the domain)</li>
                </ul>
                <p>Note: Your browser may block pop-ups the first time you use this tool. You'll need to allow pop-ups for this site for the tool to work properly.<br>
                Also, Shodan and FOFA may not show full results unless you're logged in.<br>
                This tool works best on desktop and may not function fully on mobile browsers.</p>
            </div>
        </div>
    `;
}

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

export function mountReconPage(root) {
    const form = root.querySelector('#recon-form');
    form.addEventListener('submit', event => {
        event.preventDefault();
        const domain = normalizeDomain(root.querySelector('#recon-domain').value);
        const status = root.querySelector('#recon-status');
        if (!domain) {
            status.textContent = 'Enter a valid domain name, such as example.com.';
            status.className = 'form-error';
            return;
        }
        status.textContent = '';
        status.className = '';

        const urls = [
            `https://www.google.com/search?q=site:${domain}`,
            `https://github.com/search?q=${domain}&type=code`,
            `https://web.archive.org/cdx/search/cdx?url=*.${domain}/*&output=text&fl=original&collapse=urlkey`,
            `https://www.shodan.io/search?query=${domain}`,
            `https://securitytrails.com/domain/${domain}/dns`,
            `https://search.censys.io/search?resource=hosts&q=${domain}`,
            `https://crt.sh/?q=%25.${domain}`,
            `https://intelx.io/?s=${domain}`,
            `https://otx.alienvault.com/indicator/domain/${domain}`,
            `https://hunter.how/search?q=${domain}`,
            `https://urlscan.io/search/#domain:${domain}`,
            `https://fofa.info/result?qbase64=${btoa(domain)}`,
            `https://www.virustotal.com/gui/domain/${domain}/detection`
        ];

        urls.forEach(url => window.open(url, '_blank'));
    });
}