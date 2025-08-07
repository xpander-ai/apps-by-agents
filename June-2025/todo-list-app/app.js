document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('todo-input');
  const addButton = document.getElementById('add-button');
  const todoList = document.getElementById('todo-list');
  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';
      const span = document.createElement('span');
      span.textContent = todo.text;
      span.addEventListener('click', () => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
      });
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      });
      li.appendChild(span);
      li.appendChild(removeButton);
      todoList.appendChild(li);
    });
  }

  addButton.addEventListener('click', () => {
    const text = input.value.trim();
    if (text === '') return;
    todos.push({ text, completed: false });
    input.value = '';
    saveTodos();
    renderTodos();
  });

  renderTodos();
});