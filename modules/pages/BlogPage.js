import { fetchJson } from '../data/content.js';
import { BlogItem } from '../components/BlogItem.js';

export async function BlogPage() {
    try {
        const posts = await fetchJson('/content/posts.json');
        const content = posts.length
            ? posts.map(BlogItem).join('')
            : '<p class="empty-state">No posts published yet.</p>';
        return `
            <section class="blogs-page fade-in">
                <header class="blogs-header">
                    <h1>Blogs</h1>
                </header>
                <label class="blog-search">
                    <span class="visually-hidden">Search posts</span>
                    <input id="blog-search-input" type="search" placeholder="Search posts..." autocomplete="off">
                    <span class="blog-search-icon" aria-hidden="true">⌕</span>
                </label>
                <div class="blog-list" id="blog-list">${content}</div>
                <p class="empty-state blog-no-results" id="blog-no-results" hidden>No posts match your search.</p>
            </section>
        `;
    } catch (error) {
        console.error(error);
        return '<p class="empty-state fade-in">Blog posts could not be loaded.</p>';
    }
}

export function mountBlogPage(root) {
    const search = root.querySelector('#blog-search-input');
    const list = root.querySelector('#blog-list');
    const emptyState = root.querySelector('#blog-no-results');

    search.addEventListener('input', () => {
        const query = search.value.trim().toLocaleLowerCase();
        let visibleCount = 0;

        for (const item of list.querySelectorAll('.blog-item')) {
            const matches = item.dataset.searchText.includes(query);
            item.hidden = !matches;
            if (matches) visibleCount += 1;
        }

        emptyState.hidden = visibleCount > 0;
    });
}
