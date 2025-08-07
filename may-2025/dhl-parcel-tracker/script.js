// Handle track button click and Enter key press
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('tracking-number');
  const button = document.getElementById('track-button');

  function triggerTrack() {
    const trackingNumber = input.value.trim();
    if (!trackingNumber) {
      input.classList.add('shake');
      input.addEventListener(
        'animationend',
        () => input.classList.remove('shake'),
        { once: true }
      );
      return;
    }
    const url = `https://track-trace.com/track?carrier=dhl&number=${encodeURIComponent(
      trackingNumber
    )}`;
    window.open(url, '_blank');
  }

  button.addEventListener('click', triggerTrack);
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      triggerTrack();
    }
  });
});