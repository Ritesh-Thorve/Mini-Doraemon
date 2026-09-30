import { fetchJson } from '../data/content.js';
import { ProjectCard } from '../components/ProjectCard.js';

export async function ProjectsPage() {
    try {
        const projects = await fetchJson('/content/projects/projects.json');
        const content = projects.length
            ? projects.map(ProjectCard).join('')
            : '<p class="empty-state">No projects published yet.</p>';

        return `
            <section class="projects-page fade-in">
                <div class="projects-intro">
                    <div class="projects-kicker">SECURITY RESEARCH / TOOLING</div>
                    <h1>Projects</h1>
                    <p>A collection of tools built to support reconnaissance and web security research.</p>
                </div>
                <div class="projects-list" aria-label="Selected projects">${content}</div>
            </section>
        `;
    } catch (error) {
        console.error(error);
        return '<p class="empty-state fade-in">Projects could not be loaded.</p>';
    }
}