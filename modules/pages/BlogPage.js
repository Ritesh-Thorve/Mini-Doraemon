import { fetchJson } from '../data/content.js';
import { BlogItem } from '../components/BlogItem.js';

export async function BlogPage() {
    try {
        const posts = await fetchJson('/content/posts.json');
        const content = posts.length
            ? posts.map(BlogItem).join('')
            : '<p class="empty-state">No posts published yet.</p>';
        return `<div class="blog-list fade-in">${content}</div>`;
    } catch (error) {
        console.error(error);
        return '<p class="empty-state fade-in">Blog posts could not be loaded.</p>';
    }
}