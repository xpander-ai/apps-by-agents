
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('days-container');
  let progress = JSON.parse(localStorage.getItem('yogaProgress')) || {};

  // Generate day elements
  for (let day = 1; day <= 30; day++) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('day');
    dayEl.textContent = day;
    dayEl.dataset.day = day;
    if (progress[day]) {
      dayEl.classList.add('completed');
    }
    container.appendChild(dayEl);
  }

  // Toggle completion on click
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('day')) {
      const day = e.target.dataset.day;
      progress[day] = !progress[day];
      localStorage.setItem('yogaProgress', JSON.stringify(progress));
      e.target.classList.toggle('completed');
    }
  });

  // Reset progress
  const resetBtn = document.getElementById('reset');
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset your progress?')) {
      localStorage.removeItem('yogaProgress');
      // Remove completed class from all day elements
      document.querySelectorAll('.day.completed').forEach((el) => {
        el.classList.remove('completed');
      });
      progress = {};
    }
  });
});
