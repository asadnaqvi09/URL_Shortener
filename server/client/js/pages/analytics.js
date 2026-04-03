const API_BASE = '/api/v1/analytics';

export const renderAnalytics = (root) => {
    root.innerHTML = `
        <div class="space-y-8">
            <div class="flex flex-col md:flex-row md:items-end gap-4 mb-10">
                <div class="flex-1">
                    <h1 class="text-3xl font-bold text-slate-900 mb-4">Analytics Dashboard</h1>
                    <div class="relative">
                        <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size="20"></i>
                        <input type="text" id="analytics-input" placeholder="Enter short URL ID (e.g., ab123)"
                            class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                    </div>
                </div>
                <button id="btn-fetch" class="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition">
                    Fetch Data
                </button>
            </div>
            <div id="analytics-content" class="hidden space-y-4"></div>
        </div>
    `;

    const fetchBtn = document.getElementById('btn-fetch');
    const input = document.getElementById('analytics-input');
    const content = document.getElementById('analytics-content');

    fetchBtn.addEventListener('click', async () => {
        const short_url = input.value.trim();
        if (!short_url) return alert('Enter a short URL ID');

        content.classList.add('hidden');
        content.innerHTML = '';

        try {
            const res = await fetch(`${API_BASE}/${short_url}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            const d = data.data;

            // Analytics display
            content.innerHTML = `
                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
                    <p><strong>Original URL:</strong> ${d.original_url}</p>
                    <p><strong>Short URL:</strong> <a href="/${d.short_url}" target="_blank" class="underline text-sky-600">${window.location.origin}/${d.short_url}</a></p>
                    <p><strong>Expiry Date:</strong> ${d.expiry_date || 'N/A'}</p>
                    <p><strong>Created At:</strong> ${new Date(d.created_at).toLocaleString()}</p>
                    <p><strong>Total Clicks:</strong> ${d.total_clicks}</p>
                    <p><strong>Unique Clicks:</strong> ${d.unique_clicks}</p>
                    <p><strong>Last Clicked:</strong> ${d.last_clicked ? new Date(d.last_clicked).toLocaleString() : 'N/A'}</p>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 class="font-semibold mb-2">Clicks by Device</h2>
                    <ul>
                        ${d.devices.map(dev => `<li>${dev.device || 'desktop'}: ${dev.count}</li>`).join('')}
                    </ul>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 class="font-semibold mb-2">Recent Clicks</h2>
                    <ul>
                        ${d.recentClicks.map(c => `<li>${c.ip_address} - ${c.device || 'desktop'} - ${new Date(c.clicked_at).toLocaleString()}</li>`).join('')}
                    </ul>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 class="font-semibold mb-2">Daily Clicks</h2>
                    <ul>
                        ${d.dailyClicks.map(dc => `<li>${dc.date}: ${dc.clicks}</li>`).join('')}
                    </ul>
                </div>
            `;
            content.classList.remove('hidden');
        } catch (err) {
            content.innerHTML = `<p class="text-red-600 font-medium">${err.message}</p>`;
            content.classList.remove('hidden');
        }

        lucide.createIcons();
    });
};