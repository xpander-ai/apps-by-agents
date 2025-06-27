document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('todo-input');
  const addButton = document.getElementById('add-button');
  const todoList = document.getElementById('todo-list');
  const rickGif = document.getElementById('rick-gif');
  const rickAudio = document.getElementById('rick-audio');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    todoList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = task.completed ? 'completed' : '';

      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        tasks[index].completed = checkbox.checked;
        saveTasks();
        if (checkbox.checked) {
          rickGif.style.display = 'block';
          rickAudio.currentTime = 0;
          rickAudio.play();
          setTimeout(() => {
            rickGif.style.display = 'none';
          }, 3000);
        }
        renderTasks();
      });

      const span = document.createElement('span');
      span.textContent = task.text;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Delete';
      removeBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      label.appendChild(checkbox);
      label.appendChild(span);
      li.appendChild(label);
      li.appendChild(removeBtn);
      todoList.appendChild(li);
    });
  }

  addButton.addEventListener('click', () => {
    const text = input.value.trim();
    if (text === '') return;
    tasks.push({ text, completed: false });
    input.value = '';
    saveTasks();
    renderTasks();
  });

  renderTasks();
});