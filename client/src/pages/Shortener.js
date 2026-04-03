import { Card } from '../components/Card.js';

export const ShortenerPage = () => {
    const container = document.createElement('div');
    container.className = "max-w-2xl mx-auto";
    
    const formHtml = `
        <form id="shorten-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Long URL</label>
                <input required type="url" id="long-url" placeholder="https://example.com" 
                    class="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
            </div>
            <button type="submit" id="btn-submit" class="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl hover:bg-sky-700 transition">
                Generate Short URL
            </button>
        </form>
        <div id="result-container" class="mt-6 hidden"></div>
    `;

    container.innerHTML = `
        <div class="text-center mb-10">
            <h1 class="text-4xl font-bold text-slate-900 mb-2">Shorten your links</h1>
            <p class="text-slate-500">Instant URLs with real-time tracking.</p>
        </div>
        ${Card(formHtml)}
    `;

    // Event Handling
    container.querySelector('#shorten-form').onsubmit = async (e) => {
        e.preventDefault();
        const url = container.querySelector('#long-url').value;
        const btn = container.querySelector('#btn-submit');
        
        btn.innerText = "Loading...";
        btn.disabled = true;

        try {
            const res = await fetch('/api/v1/url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            
            const resultDiv = container.querySelector('#result-container');
            resultDiv.classList.remove('hidden');
            resultDiv.innerHTML = Card(`
                <div class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input readonly value="${data.short_url}" class="bg-transparent flex-1 text-sky-600 font-medium outline-none">
                    <button id="copy-btn" class="p-2 hover:bg-white rounded-lg transition">
                        <i data-lucide="copy" size="18"></i>
                    </button>
                </div>
            `, "Success!");
            lucide.createIcons();
        } catch (err) {
            alert("Error connecting to API");
        } finally {
            btn.innerText = "Generate Short URL";
            btn.disabled = false;
        }
    };

    return container;
};