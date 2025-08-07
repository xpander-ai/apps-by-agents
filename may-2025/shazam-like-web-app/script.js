document.addEventListener('DOMContentLoaded', () => {
  const listenBtn = document.getElementById('listen-btn');
  const songTitleEl = document.getElementById('song-title');
  const songs = [
    'Shape of You - Ed Sheeran',
    'Blinding Lights - The Weeknd',
    'Rolling in the Deep - Adele',
    'Levitating - Dua Lipa',
    'Uptown Funk - Bruno Mars'
  ];

  listenBtn.addEventListener('click', () => {
    listenBtn.disabled = true;
    songTitleEl.textContent = 'Listening...';
    setTimeout(() => {
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      songTitleEl.textContent = randomSong;
      listenBtn.disabled = false;
    }, 2000);
  });
});