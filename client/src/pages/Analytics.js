import { Card } from '../components/Card.js';
import { StatCard } from '../components/StatCard.js';

export const AnalyticsPage = () => {
    const container = document.createElement('div');
    container.className = "space-y-8";

    container.innerHTML = `
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
        <div id="analytics-content" class="hidden"></div>
    `;

    const fetchAnalytics = async () => {
        const id = container.querySelector('#analytics-input').value;
        const btn = container.querySelector('#btn-fetch');
        const content = container.querySelector('#analytics-content');

        if (!id) return alert("Please enter a URL ID");

        btn.innerText = "Loading...";
        try {
            const res = await fetch(`/api/v1/analytics/${id}`);
            if (!res.ok) throw new Error("URL not found");
            const data = await res.json();

            content.classList.remove('hidden');
            content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    ${StatCard("Total Clicks", data.total_clicks, "mouse-pointer-2", "text-blue-600")}
                    ${StatCard("Unique Users", data.unique_clicks, "users", "text-purple-600")}
                    ${StatCard("Last Click", data.last_clicked || 'N/A', "clock", "text-orange-600")}
                    ${StatCard("Top Device", data.top_device || 'N/A', "smartphone", "text-green-600")}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${Card(`
                        <div class="h-48 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <p class="text-slate-400 text-sm italic">Daily Clicks Graph Placeholder</p>
                        </div>
                    `, "Click Activity")}
                    
                    ${Card(`
                        <table class="w-full text-sm text-left">
                            <thead class="text-slate-400 border-b">
                                <tr><th class="pb-2 font-medium">Device</th><th class="pb-2 font-medium text-right">Time</th></tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                ${data.recent_clicks.map(c => `
                                    <tr>
                                        <td class="py-3 font-medium text-slate-700">${c.device}</td>
                                        <td class="py-3 text-right text-slate-500 font-mono text-xs">${c.time}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `, "Recent Clicks")}
                </div>
            `;
            // Refresh icons after generating HTML
            lucide.createIcons();
        } catch (err) {
            alert(err.message);
        } finally {
            btn.innerText = "Fetch Data";
        }
    };

    container.querySelector('#btn-fetch').onclick = fetchAnalytics;
    return container;
};