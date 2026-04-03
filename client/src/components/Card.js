 export const Card = (content, title = "") => {
    return `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 fade-in">
            ${title ? `<h3 class="text-lg font-semibold text-slate-800 mb-4">${title}</h3>` : ''}
            ${content}
        </div>
    `;
};