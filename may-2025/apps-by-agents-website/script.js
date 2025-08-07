// Toggle mobile navigation menu
document.getElementById('menu-toggle').addEventListener('click', function() {
  const menu = document.querySelector('nav ul');
  menu.classList.toggle('open');
});