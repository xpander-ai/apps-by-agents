function pad(n) {
    return n < 10 ? '0' + n : n;
}

function getSoothingColor(hour, minute, second) {
    // Map time to HSL color for smooth transitions
    // Hue: 0-360 (full spectrum), Lightness: 60-80% for soothing effect
    const totalSeconds = hour * 3600 + minute * 60 + second;
    const secondsInDay = 24 * 3600;
    const hue = (totalSeconds / secondsInDay) * 360;
    const lightness = 70 + 10 * Math.sin((totalSeconds / secondsInDay) * Math.PI * 2);
    return `hsl(${hue.toFixed(0)}, 60%, ${lightness.toFixed(0)}%)`;
}

function updateClock() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    document.getElementById('clock').textContent = `${pad(hour)}:${pad(minute)}:${pad(second)}`;
    document.body.style.background = getSoothingColor(hour, minute, second);
}

setInterval(updateClock, 1000);
updateClock();
