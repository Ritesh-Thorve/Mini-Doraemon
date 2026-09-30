import { escapeHtml } from './html.js';

export function BlogItem(post) {
    const postPath = `/blog/${encodeURIComponent(post.id)}`;
    const searchText = post.searchText || `${post.title} ${post.description} ${post.date}`;
    return `
        <article class="blog-item" data-search-text="${escapeHtml(searchText).toLocaleLowerCase()}">
            <a class="blog-item-title" href="${postPath}"><h2>${escapeHtml(post.title)}</h2></a>
            <div class="date">${escapeHtml(post.date)}</div>
        </article>
    `;
}