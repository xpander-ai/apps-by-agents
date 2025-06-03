document.getElementById('add-btn').onclick = () => {
  const input = document.getElementById('new-todo');
  if (!input.value.trim()) return;
  const li = document.createElement('li');
  li.textContent = input.value.trim();
  li.onclick = () => li.classList.toggle('completed');
  document.getElementById('todos').appendChild(li);
  input.value = '';
};