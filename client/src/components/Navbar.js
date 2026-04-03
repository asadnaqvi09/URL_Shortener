export const Navbar = (onNavClick) => {
    const nav = document.createElement('nav');
    nav.className = "bg-white border-b sticky top-0 z-10";
    nav.innerHTML = `
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2 font-bold text-xl text-sky-600 cursor-pointer" id="logo">
                <i data-lucide="link-2"></i> <span>Briefly</span>
            </div>
            <div class="flex gap-2">
                <button id="nav-home" class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-50 transition">Shorten</button>
                <button id="nav-stats" class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-50 transition">Analytics</button>
            </div>
        </div>
    `;

    // Parent-Child Communication via Callbacks
    nav.querySelector('#nav-home').onclick = () => onNavClick('home');
    nav.querySelector('#nav-stats').onclick = () => onNavClick('analytics');
    nav.querySelector('#logo').onclick = () => onNavClick('home');
    
    return nav;
};