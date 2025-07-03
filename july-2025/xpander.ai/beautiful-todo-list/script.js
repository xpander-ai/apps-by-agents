document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('task-input');
  const addBtn = document.getElementById('add-task-btn');
  const list = document.getElementById('task-list');

  function createTask(text) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = text;
    span.addEventListener('click', () => span.classList.toggle('completed'));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => list.removeChild(li));

    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
  }

  addBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (text) {
      list.appendChild(createTask(text));
      input.value = '';
      input.focus();
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
  });
});