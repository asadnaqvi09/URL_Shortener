const API_BASE = '/api/v1';

export const renderShortener = (root) => {
    root.innerHTML = `
        <div class="text-center mb-10">
            <h1 class="text-4xl font-bold text-slate-900 mb-2">Shorten your links</h1>
            <p class="text-slate-500">Instant URLs with real-time tracking.</p>
        </div>
        <div class="max-w-2xl mx-auto mb-8">
            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <form id="shorten-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Long URL</label>
                        <input required type="url" id="long-url" placeholder="https://example.com"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Expiry Date (optional)</label>
                        <input type="datetime-local" id="expiry-date"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                    </div>
                    <button type="submit" id="btn-submit" class="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl hover:bg-sky-700 transition">
                        Generate Short URL
                    </button>
                </form>
                <div id="form-result" class="mt-6 hidden"></div>
            </div>
        </div>
        <div class="max-w-3xl mx-auto">
            <h2 class="text-2xl font-semibold mb-4">Your URLs</h2>
            <div id="urls-container" class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p class="text-slate-500">No URLs yet.</p>
            </div>
        </div>
    `;
    const form = document.getElementById('shorten-form');
    const formResult = document.getElementById('form-result');
    const urlsContainer = document.getElementById('urls-container');
    const fetchAllUrls = async () => {
        try {
            const res = await fetch(`${API_BASE}/url`);
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            renderUrls(data.data);
        } catch (err) {
            urlsContainer.innerHTML = `<p class="text-red-600">${err.message}</p>`;
        }
    };

    const renderUrls = (urls) => {
        if (!urls.length) {
            urlsContainer.innerHTML = `<p class="text-slate-500">No URLs yet.</p>`;
            return;
        }
        urlsContainer.innerHTML = `
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b">
                        <th class="py-2 px-3">Short URL</th>
                        <th class="py-2 px-3">Original URL</th>
                        <th class="py-2 px-3">Expiry</th>
                        <th class="py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${urls.map(url => `
                        <tr class="border-b hover:bg-slate-50" data-short="${url.short_url}">
                            <td class="py-2 px-3">
                                <a href="/${url.short_url}" target="_blank" class="text-sky-600 underline">
                                    ${window.location.origin}/${url.short_url}
                                </a>
                            </td>
                            <td class="py-2 px-3">${url.original_url}</td>
                            <td class="py-2 px-3">${url.expiry_date ? new Date(url.expiry_date).toLocaleString() : '-'}</td>
                            <td class="py-2 px-3 flex gap-2">
                                <button class="delete-btn bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                                <button class="qr-btn bg-slate-600 text-white px-3 py-1 rounded hover:bg-slate-700">QR</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const short_url = e.target.closest('tr').dataset.short;
                try {
                    const res = await fetch(`${API_BASE}/url/${short_url}`, { method: 'DELETE' });
                    const data = await res.json();
                    if (!data.success) throw new Error(data.message);
                    fetchAllUrls();
                } catch (err) {
                    alert(err.message);
                }
            });
        });
        document.querySelectorAll('.qr-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const short_url = e.target.closest('tr').dataset.short;
                try {
                    const res = await fetch(`${API_BASE}/url/${short_url}/qr`);
                    const data = await res.json();
                    if (!data.success) throw new Error(data.message);
                    const img = document.createElement('img');
                    img.src = data.qr_code;
                    img.className = 'mt-2 border rounded';
                    e.target.closest('tr').appendChild(img);
                    e.target.disabled = true;
                } catch (err) {
                    alert(err.message);
                }
            });
        });
    };
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const original_url = document.getElementById('long-url').value;
        const expiry_date = document.getElementById('expiry-date').value || null;

        try {
            const res = await fetch(`${API_BASE}/url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ original_url, expiry_date })
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            formResult.innerHTML = `<p class="text-green-600 font-medium">Short URL created: <a href="/${data.data.short_url}" target="_blank" class="underline text-sky-600">${window.location.origin}/${data.data.short_url}</a></p>`;
            formResult.classList.remove('hidden');
            fetchAllUrls();
        } catch (err) {
            formResult.innerHTML = `<p class="text-red-600 font-medium">${err.message}</p>`;
            formResult.classList.remove('hidden');
        }
    });
    fetchAllUrls();
};