import { escapeHtml } from '../components/html.js';

export async function BlogPostPage(slug) {
    if (!/^[a-z0-9-]+$/i.test(slug)) {
        return '<p class="fade-in">Post not found.</p>';
    }

    try {
        const response = await fetch(`/content/blogs/${encodeURIComponent(slug)}.md`);
        if (!response.ok) throw new Error('Post not found');
        const text = await response.text();
        let content = text;
        let title = 'Untitled';
        let date = '';

        if (text.startsWith('---')) {
            const endFrontmatter = text.indexOf('---', 3);
            if (endFrontmatter !== -1) {
                const frontmatter = text.substring(3, endFrontmatter);
                content = text.substring(endFrontmatter + 3).trim();
                const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?(\n|$)/);
                const dateMatch = frontmatter.match(/date:\s*["']?(.*?)["']?(\n|$)/);
                if (titleMatch) title = titleMatch[1];
                if (dateMatch) date = dateMatch[1];
            }
        }

        return `
            <article class="blog-article fade-in">
                <header>
                    <h1>${escapeHtml(title)}</h1>
                    <div class="date">${escapeHtml(date)}</div>
                </header>
                <div class="blog-content">${window.marked.parse(content)}</div>
            </article>
        `;
    } catch (error) {
        console.error(error);
        return '<p class="fade-in" style="margin-top: 2rem;">Post not found.</p>';
    }
}