import { mountDorkLauncher } from './modules/dork/launcher.js';

const app = document.getElementById('app');

const templates = {
    home: `
        <div class="hero fade-in">
            <div class="hero-heading">
                <h1>Hey,</h1>
                <h2>It's Ritesh</h2>
            </div>
            <p>A security researcher focused on web application and Android security. I spend my time researching vulnerabilities, learning application security, and working on bug bounty programs.</p>
            <p>I also write about security research, vulnerability discovery, web security, and Android security. If you want to contact me, let's contact via <a href="mailto:email@example.com" class="accent">email.</a></p>
        </div>
    `,
    cves: `
        <div class="fade-in">
            <h1 style="color: white; margin-bottom: 1rem;">CVEs</h1>
            <p>Coming soon...</p>
        </div>
    `,
    blogList: `
        <div class="blog-list fade-in" id="blog-list-container">
            <!-- Blogs injected here -->
        </div>
    `,
    blogPost: (html, title, date) => `
        <article class="blog-article fade-in">
            <header>
                <h1>${title}</h1>
                <div class="date">${date}</div>
            </header>
            <div class="blog-content">
                ${html}
            </div>
        </article>
    `,
    recon: `
        <div class="launcher-container fade-in">
            <div class="launcher-header">
                <h1>Recon Launcher</h1>
                <p>This tool is a target reconnaissance launcher designed to assist security researchers, bug bounty hunters, and penetration testers in quickly gathering publicly available intelligence about a target domain.</p>
            </div>
            
            <form id="recon-form" class="form-group" onsubmit="launchRecon(event)">
                <input type="text" id="recon-domain" class="input-field" placeholder="Enter domain (e.g. example.com)" required>
                <div style="margin-top: 1rem;">
                    <button type="submit" class="btn-primary">Launch Recon</button>
                </div>
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
    `
};

async function renderBlogList() {
    app.innerHTML = templates.blogList;
    const container = document.getElementById('blog-list-container');
    container.innerHTML = '<p>Loading...</p>';

    try {
        const res = await fetch('/content/posts.json');
        if (!res.ok) throw new Error('Failed to load posts');
        const posts = await res.json();

        container.innerHTML = posts.map(post => `
            <div class="blog-item">
                <a href="/blog/${post.id}"><h2>${post.title}</h2></a>
                <div class="date">${post.date}</div>
                <p>${post.description}</p>
                <a href="/blog/${post.id}" class="read-btn">Read &rarr;</a>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<p>Failed to load blog posts. Ensure you are running a local server.</p>';
        console.error(e);
    }
}

async function renderBlogPost(slug) {
    app.innerHTML = '<p class="fade-in" style="margin-top: 2rem;">Loading...</p>';

    try {
        const res = await fetch(`/content/blogs/${slug}.md`);
        if (!res.ok) throw new Error('Post not found');
        const text = await res.text();

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

        const html = marked.parse(content);
        app.innerHTML = templates.blogPost(html, title, date);
    } catch (e) {
        app.innerHTML = '<p class="fade-in" style="margin-top: 2rem;">Post not found.</p>';
        console.error(e);
    }
}

// Recon Logic
window.launchRecon = function(e) {
    e.preventDefault();
    const domain = document.getElementById('recon-domain').value.trim();
    if(!domain) return;
    
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
};

function router() {
    const path = window.location.pathname || '/';
    document.body.classList.toggle('dork-page', path === '/dork');
    
    document.querySelectorAll('nav a').forEach(el => {
        el.classList.remove('active');
        const href = el.getAttribute('href');
        if (path === '/' && href === '/') {
            el.classList.add('active');
        } else if (href !== '/' && path.startsWith(href)) {
            el.classList.add('active');
        }
    });

    window.scrollTo(0, 0);

    if (path === '/') {
        app.innerHTML = templates.home;
    } else if (path === '/cves') {
        app.innerHTML = templates.cves;
    } else if (path === '/blog' || path === '/blog/') {
        renderBlogList();
    } else if (path.startsWith('/blog/')) {
        const slug = path.split('/')[2];
        renderBlogPost(slug);
    } else if (path === '/recon') {
        app.innerHTML = templates.recon;
    } else if (path === '/dork') {
        mountDorkLauncher(app);
    } else {
        app.innerHTML = templates.home;
    }
}

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

// Intercept all internal link clicks
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    // Only intercept internal links (starting with /)
    if (href && href.startsWith('/') && !link.getAttribute('target')) {
        e.preventDefault();
        navigateTo(href);
    }
});

window.addEventListener('popstate', router);
window.addEventListener('load', router);
