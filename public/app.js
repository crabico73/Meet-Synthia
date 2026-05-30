// Synthia Frontend — Meet Synthia Landing Page

(function() {
    const form = document.getElementById('insight-form');
    const topicInput = document.getElementById('topic-input');
    const loading = document.getElementById('insight-loading');
    const result = document.getElementById('insight-result');
    const quoteEl = result.querySelector('.insight-quote');
    const newBtn = document.getElementById('new-insight-btn');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const topic = topicInput.value.trim();
        if (!topic) return;

        // Show loading
        form.style.display = 'none';
        loading.style.display = 'block';
        result.style.display = 'none';

        try {
            const resp = await fetch('/api/insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });

            const data = await resp.json();

            loading.style.display = 'none';

            if (data.error) {
                quoteEl.textContent = 'Synthia says: ' + data.error;
            } else {
                quoteEl.textContent = data.insight || data.quote || JSON.stringify(data);
            }
            result.style.display = 'block';
        } catch (err) {
            loading.style.display = 'none';
            quoteEl.textContent = 'Synthia is temporarily unavailable. Try again in a moment.';
            result.style.display = 'block';
            console.error('Insight error:', err);
        }
    });

    if (newBtn) {
        newBtn.addEventListener('click', function() {
            result.style.display = 'none';
            form.style.display = 'flex';
            topicInput.value = '';
            topicInput.focus();
        });
    }
})();
