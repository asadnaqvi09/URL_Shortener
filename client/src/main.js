import { Navbar } from './components/Navbar.js';
import { ShortenerPage } from './pages/Shortener.js';
import { AnalyticsPage } from './pages/Analytics.js';

const appRoot = document.getElementById('app-root');
const navRoot = document.getElementById('navbar-root');

// Simple State: Current View
let currentView = 'home';

const render = () => {
    // Clear previous view
    appRoot.innerHTML = '';
    
    // Parent logic to decide which child to render
    if (currentView === 'home') {
        appRoot.appendChild(ShortenerPage());
    } else {
        // AnalyticsPage logic would be similar to ShortenerPage
        appRoot.appendChild(AnalyticsPage());
    }
    
    // Re-initialize icons for new elements
    lucide.createIcons();
};

// Initial Load
navRoot.appendChild(Navbar((view) => {
    currentView = view;
    render();
}));

render();