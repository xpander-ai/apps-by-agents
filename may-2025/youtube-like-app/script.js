// Mock video data
const videos = [
  { id: 1, title: "Sample Video 1", thumbnail: "https://via.placeholder.com/320x180?text=Video+1" },
  { id: 2, title: "Sample Video 2", thumbnail: "https://via.placeholder.com/320x180?text=Video+2" },
  { id: 3, title: "Sample Video 3", thumbnail: "https://via.placeholder.com/320x180?text=Video+3" },
  { id: 4, title: "Sample Video 4", thumbnail: "https://via.placeholder.com/320x180?text=Video+4" },
  { id: 5, title: "Sample Video 5", thumbnail: "https://via.placeholder.com/320x180?text=Video+5" },
  { id: 6, title: "Sample Video 6", thumbnail: "https://via.placeholder.com/320x180?text=Video+6" }
];

/**
 * Render an array of videos into the grid.
 * @param {Array} videoList - List of video objects
 */
function renderVideos(videoList) {
  const container = document.getElementById("videoGrid");
  container.innerHTML = "";
  videoList.forEach((video) => {
    const card = document.createElement("div");
    card.className = "video-card";

    const img = document.createElement("img");
    img.src = video.thumbnail;
    img.alt = video.title;
    card.appendChild(img);

    const info = document.createElement("div");
    info.className = "video-info";
    const title = document.createElement("h3");
    title.className = "video-title";
    title.textContent = video.title;
    info.appendChild(title);
    card.appendChild(info);

    container.appendChild(card);
  });
}

// Search functionality
document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(query)
  );
  renderVideos(filtered);
});

// Initial render on page load
window.addEventListener("DOMContentLoaded", () => {
  renderVideos(videos);
});