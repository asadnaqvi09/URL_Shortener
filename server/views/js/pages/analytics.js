const API_BASE = '/api/v1/analytics';

export const renderAnalytics = (root) => {
    root.innerHTML = `
        <div class="space-y-8">
            <div class="flex flex-col md:flex-row md:items-end gap-4 mb-10">
                <div class="flex-1">
                    <h1 class="text-3xl font-bold text-slate-900 mb-4">Analytics Dashboard</h1>
                    <div class="relative">
                        <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size="20"></i>
                        <input type="text" id="analytics-input" placeholder="Enter short URL ID or paste link"
                            class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                    </div>
                </div>
                <button id="btn-fetch" class="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition flex items-center justify-center min-w-[140px]">
                    <span id="btn-text">Fetch Data</span>
                </button>
            </div>
            <div id="analytics-content" class="hidden space-y-6"></div>
        </div>
    `;

    const fetchBtn = document.getElementById('btn-fetch');
    const btnText = document.getElementById('btn-text');
    const input = document.getElementById('analytics-input');
    const content = document.getElementById('analytics-content');
    
    let refreshInterval = null;

    const fetchData = async () => {
        let rawInput = input.value.trim();
        if (!rawInput) return;

        const short_url = rawInput.replace(/\/$/, "").split('/').pop();

        btnText.innerText = 'Loading...';
        fetchBtn.disabled = true;

        try {
            const res = await fetch(`${API_BASE}/${short_url}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            const d = data.data;
            renderData(d);
            
            if (!refreshInterval) {
                refreshInterval = setInterval(silentlyUpdateData, 10000, short_url);
            }
        } catch (err) {
            content.innerHTML = `<div class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">${err.message}</div>`;
            content.classList.remove('hidden');
            clearInterval(refreshInterval);
            refreshInterval = null;
        } finally {
            btnText.innerText = 'Fetch Data';
            fetchBtn.disabled = false;
        }
    };

    const silentlyUpdateData = async (short_url) => {
        try {
            const res = await fetch(`${API_BASE}/${short_url}`);
            const data = await res.json();
            if (data.success) renderData(data.data);
        } catch (err) {
            console.error("Silent update failed");
        }
    };

    const renderData = (d) => {
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <p class="text-sm font-medium text-slate-500 mb-1">Total Clicks</p>
                    <h3 class="text-3xl font-bold text-slate-900">${d.total_clicks}</h3>
                </div>
                <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <p class="text-sm font-medium text-slate-500 mb-1">Unique Visitors</p>
                    <h3 class="text-3xl font-bold text-sky-600">${d.unique_clicks}</h3>
                </div>
                <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <p class="text-sm font-medium text-slate-500 mb-1">Last Activity</p>
                    <h3 class="text-lg font-bold text-slate-900 mt-2">${d.last_clicked ? new Date(d.last_clicked).toLocaleTimeString() : 'No clicks'}</h3>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 class="font-semibold text-slate-700">Link Information</h2>
                </div>
                <div class="p-6">
                    <p class="text-sm text-slate-500 mb-1">Destination URL</p>
                    <p class="truncate text-slate-800 font-medium mb-4">${d.original_url || 'N/A'}</p>
                    <p class="text-sm text-slate-500 mb-1">Short Link</p>
                    <a href="/${d.short_url}" target="_blank" class="text-sky-600 hover:text-sky-700 font-medium underline">
                        ${window.location.origin}/${d.short_url}
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i data-lucide="smartphone" size="18"></i> Clicks by Device
                    </h2>
                    <div class="space-y-3">
                        ${d.devices.length ? d.devices.map(dev => `
                            <div class="flex items-center justify-between">
                                <span class="capitalize text-slate-600">${dev.device}</span>
                                <span class="font-bold text-slate-900">${dev.count}</span>
                            </div>
                            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div class="bg-sky-500 h-full" style="width: ${(dev.count / d.total_clicks * 100)}%"></div>
                            </div>
                        `).join('') : '<p class="text-slate-400">No device data available</p>'}
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i data-lucide="history" size="18"></i> Recent Activity
                    </h2>
                    <div class="space-y-4">
                        ${d.recentClicks.length ? d.recentClicks.map(c => `
                            <div class="flex items-center justify-between text-sm border-b border-slate-50 pb-2">
                                <div>
                                    <p class="font-medium text-slate-700">${c.ip_address.replace(/^(?:\d{1,3}\.){2}/, "xxx.xxx.")}</p>
                                    <p class="text-xs text-slate-400">${new Date(c.clicked_at).toLocaleString()}</p>
                                </div>
                                <span class="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-500 uppercase">${c.device}</span>
                            </div>
                        `).join('') : '<p class="text-slate-400">No recent activity</p>'}
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 class="font-bold text-slate-800 mb-4">Daily Performance</h2>
                <div class="flex items-end gap-2 h-32">
                    ${d.dailyClicks.length ? d.dailyClicks.map(dc => {
                        const height = (dc.clicks / Math.max(...d.dailyClicks.map(x => x.clicks)) * 100);
                        return `
                            <div class="flex-1 flex flex-col items-center gap-2 group">
                                <div class="w-full bg-sky-100 group-hover:bg-sky-200 rounded-t-md transition-all relative" style="height: ${height}%">
                                    <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">${dc.clicks}</span>
                                </div>
                                <span class="text-[10px] text-slate-400 rotate-45 md:rotate-0">${dc.date.split('-').slice(1).join('/')}</span>
                            </div>
                        `;
                    }).join('') : '<p class="text-slate-400">No daily data</p>'}
                </div>
            </div>
        `;
        content.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
    };

    fetchBtn.addEventListener('click', () => {
        clearInterval(refreshInterval);
        refreshInterval = null;
        fetchData();
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearInterval(refreshInterval);
            refreshInterval = null;
            fetchData();
        }
    });

    window.addEventListener('hashchange', () => clearInterval(refreshInterval));
};