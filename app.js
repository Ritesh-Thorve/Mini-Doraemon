import { mountDorkLauncher } from './modules/dork/launcher.js';
import { BlogPage, mountBlogPage } from './modules/pages/BlogPage.js';
import { BlogPostPage } from './modules/pages/BlogPostPage.js';
import { CvesPage } from './modules/pages/CvesPage.js';
import { DorkPage } from './modules/pages/DorkPage.js';
import { HomePage } from './modules/pages/HomePage.js';
import { ProjectsPage } from './modules/pages/ProjectsPage.js';
import { mountReconPage, ReconPage } from './modules/pages/ReconPage.js';

const app = document.getElementById('app');

async function mountPage(render, ...args) {
    const pathname = window.location.pathname;
    app.innerHTML = '<p class="fade-in">Loading...</p>';

    try {
        const markup = await render(...args);
        if (window.location.pathname !== pathname) return;
        app.innerHTML = markup;

        if (pathname === '/blog' || pathname === '/blog/') mountBlogPage(app);
        if (pathname === '/recon') mountReconPage(app);
        if (pathname === '/dork') mountDorkLauncher(app);
    } catch (error) {
        if (window.location.pathname === pathname) {
            app.innerHTML = '<p class="fade-in">This page could not be loaded.</p>';
        }
        console.error(error);
    }
}

function router() {
    const path = window.location.pathname || '/';
    document.body.classList.toggle('dork-page', path === '/dork');

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if ((path === '/' && href === '/') || (href !== '/' && path.startsWith(href))) {
            link.classList.add('active');
        }
    });

    window.scrollTo(0, 0);

    if (path === '/') {
        mountPage(HomePage);
    } else if (path === '/cves') {
        mountPage(CvesPage);
    } else if (path === '/projects') {
        mountPage(ProjectsPage);
    } else if (path === '/blog' || path === '/blog/') {
        mountPage(BlogPage);
    } else if (path.startsWith('/blog/')) {
        const slug = decodeURIComponent(path.slice('/blog/'.length));
        mountPage(BlogPostPage, slug);
    } else if (path === '/recon') {
        mountPage(ReconPage);
    } else if (path === '/dork') {
        mountPage(DorkPage);
    } else {
        mountPage(HomePage);
    }
}

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('/') && !link.getAttribute('target')) {
        event.preventDefault();
        navigateTo(href);
    }
});

window.addEventListener('popstate', router);
window.addEventListener('load', router);