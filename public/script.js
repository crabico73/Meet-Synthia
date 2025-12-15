document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const backBtn = document.getElementById('back-btn');
    const homeScreen = document.getElementById('home-screen');
    const outputScreen = document.getElementById('output-screen');

    startBtn.addEventListener('click', () => {
        homeScreen.style.display = 'none';
        outputScreen.style.display = 'block';
    });

    backBtn.addEventListener('click', () => {
        homeScreen.style.display = 'block';
        outputScreen.style.display = 'none';
    });
});