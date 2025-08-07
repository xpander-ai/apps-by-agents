const mockVideos = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Video)',
    channel: 'Rick Astley',
    views: '1.2B views',
    date: '13 years ago',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    channel: 'Luis Fonsi',
    views: '7.5B views',
    date: '6 years ago',
    thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk'
  },
  {
    id: '3JZ_D3ELwOQ',
    title: 'Charlie Puth - Attention [Official Video]',
    channel: 'Charlie Puth',
    views: '1.4B views',
    date: '5 years ago',
    thumbnail: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ'
  }
];

function createVideoCard(video) {
  return `
    <div class="video-card">
      <img src="${video.thumbnail}" alt="${video.title}">
      <div class="video-info">
        <h3 class="video-title">${video.title}</h3>
        <p class="video-channel">${video.channel}</p>
        <p class="video-stats">${video.views} • ${video.date}</p>
      </div>
    </div>
  `;
}

function renderVideos() {
  const grid = document.querySelector('.video-grid');
  grid.innerHTML = mockVideos.map(createVideoCard).join('');
}

function setupEventListeners() {
  const modal = document.getElementById('player-modal');
  const player = document.getElementById('video-player');
  const closeBtn = document.querySelector('.close-button');

  document.querySelectorAll('.video-card').forEach((card, idx) => {
    card.addEventListener('click', () => {
      player.src = mockVideos[idx].videoUrl;
      modal.classList.add('open');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
    player.src = '';
  });
}

function init() {
  renderVideos();
  setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);