import { escapeHtml } from './html.js';

export function BlogItem(post) {
    const postPath = `/blog/${encodeURIComponent(post.id)}`;
    return `
        <article class="blog-item">
            <a href="${postPath}"><h2>${escapeHtml(post.title)}</h2></a>
            <div class="date">${escapeHtml(post.date)}</div>
            <p>${escapeHtml(post.description)}</p>
            <a href="${postPath}" class="read-btn">Read &rarr;</a>
        </article>
    `;
}