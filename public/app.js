document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const outputScreen = document.getElementById('output-screen');
    const insightForm = document.getElementById('insight-form');
    const topicInput = document.getElementById('topic-input');
    const insightContainer = document.getElementById('insight-container');
    const backBtn = document.getElementById('back-btn');

    insightForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topic = topicInput.value;

        if (!topic) {
            alert('Please enter a topic.');
            return;
        }

        // Switch to the output screen and show a loading message
        homeScreen.style.display = 'none';
        outputScreen.style.display = 'block';
        insightContainer.innerHTML = '<p class="loading">Generating insight...</p>';

        try {
            const response = await fetch('/api/insight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic })
            });

            const data = await response.json();

            if (response.ok) {
                // Format the response into the desired HTML structure
                insightContainer.innerHTML = `
                    <div class="output-box">
                        <h2>✨ Synthia’s Insight</h2>
                        <p>${data.insight}</p>
                        <h3>Reflection</h3>
                        <p>${data.reflection}</p>
                        <h4>Continue Your Reading</h4>
                        <p>${data.cta}</p>
                    </div>
                    <div class="output-actions">
                        <button>Share</button>
                        <button>Copy</button>
                    </div>
                `;
            } else {
                insightContainer.innerHTML = `<p class="error">Error: ${data.error}</p>`;
            }
        } catch (error) {
            insightContainer.innerHTML = `<p class="error">A network error occurred. Please try again.</p>`;
        }
    });

    // Handle the back button to return to the main screen
    backBtn.addEventListener('click', () => {
        homeScreen.style.display = 'block';
        outputScreen.style.display = 'none';
        topicInput.value = ''; // Clear the input field
    });
});
