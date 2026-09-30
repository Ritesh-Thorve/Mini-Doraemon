import { fetchJson } from '../data/content.js';
import { CveItem } from '../components/CveItem.js';

export async function CvesPage() {
    try {
        const cves = await fetchJson('/content/cves/cves.json');
        const content = cves.length
            ? cves.map(CveItem).join('')
            : '<p class="empty-state">No CVEs published yet.</p>';

        return `
            <section class="cves-page fade-in">
                <div class="cves-intro">
                    <h1>CVEs</h1>
                    <p>Published vulnerability disclosures and acknowledgements.</p>
                </div>
                <div class="cve-list" aria-label="Published CVEs">${content}</div>
            </section>
        `;
    } catch (error) {
        console.error(error);
        return '<p class="empty-state fade-in">CVEs could not be loaded.</p>';
    }
}