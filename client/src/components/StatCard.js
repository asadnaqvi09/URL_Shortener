export const StatCard = (label, value, iconName, colorClass) => {
    return `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4 fade-in">
            <div class="p-3 rounded-xl bg-slate-50 ${colorClass}">
                <i data-lucide="${iconName}" size="24"></i>
            </div>
            <div>
                <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">${label}</p>
                <p class="text-xl font-bold text-slate-900">${value}</p>
            </div>
        </div>
    `;
};