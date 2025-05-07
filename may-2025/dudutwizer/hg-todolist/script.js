// Hitchhiker's Guide To-Do List App
// By David Twizer

const quotes = [
  "Don't Panic!",
  'Time is an illusion. Lunchtime doubly so.',
  'The ships hung in the sky in much the same way that bricks don’t.',
  'So long, and thanks for all the fish.',
  'A towel is about the most massively useful thing an interstellar hitchhiker can have.',
  'I love deadlines. I love the whooshing noise they make as they go by.',
  'The Answer to the Ultimate Question of Life, the Universe, and Everything is 42.',
  'In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move.',
  'For a moment, nothing happened. Then, after a second or so, nothing continued to happen.',
  'Anyone who is capable of getting themselves made President should on no account be allowed to do the job.'
];

function randomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

document.getElementById('quote').textContent = randomQuote();

const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const panicBtn = document.getElementById('panicBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('hgTasks') || '[]');

function saveTasks() {
  localStorage.setItem('hgTasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li style="text-align:center;color:#ffe066;">No tasks. Go grab your towel!</li>';
    return;
  }
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `${task.text}, ${task.category}, ${task.priority}, ${task.completed ? 'completed' : 'not completed'}`);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'task-info';
    infoDiv.innerHTML = `<span>${task.text}</span>
      <span class="task-category">${task.category}</span>
      <span class="task-priority">${task.priority}</span>`;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
    completeBtn.setAttribute('aria-label', task.completed ? 'Mark as not completed' : 'Mark as completed');
    completeBtn.onclick = () => {
      tasks[idx].completed = !tasks[idx].completed;
      saveTasks();
      renderTasks();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.onclick = () => {
      if (confirm('Are you sure? Even Zaphod would think twice!')) {
        tasks.splice(idx, 1);
        saveTasks();
        renderTasks();
      }
    };

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);
    li.appendChild(infoDiv);
    li.appendChild(actionsDiv);
    taskList.appendChild(li);
  });
}

addTaskBtn.onclick = () => {
  const text = taskInput.value.trim();
  const category = categoryInput.value;
  const priority = priorityInput.value;
  if (!text) {
    alert("You forgot to enter a task! Even Marvin wouldn't do that.");
    return;
  }
  tasks.push({ text, category, priority, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
};

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTaskBtn.click();
});

panicBtn.onclick = () => {
  alert("DON'T PANIC!\n\nTake a deep breath. Grab your towel.\n\n'\"The ships hung in the sky in much the same way that bricks don’t.\"\n– Douglas Adams");
  priorityInput.value = 'Panic';
  priorityInput.focus();
};

renderTasks();
