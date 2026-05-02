import { renderShortener } from './pages/shortner.js';
import { renderAnalytics } from './pages/analytics.js';

const appRoot = document.getElementById('app-root');
const logo = document.getElementById('logo');
const navHome = document.getElementById('nav-home');
const navAnalytics = document.getElementById('nav-analytics');

const renderPage = (page) => {
    if (!appRoot) return;
    appRoot.innerHTML = '';
    if (page === 'home') renderShortener(appRoot);
    else renderAnalytics(appRoot);
    if (window.lucide) lucide.createIcons();
};

// Attach SPA navigation events
logo?.addEventListener('click', () => renderPage('home'));
navHome?.addEventListener('click', () => renderPage('home'));
navAnalytics?.addEventListener('click', () => renderPage('analytics'));

// Initial page load
renderPage('home');

// Expose globally if needed
window.appNavigate = renderPage;