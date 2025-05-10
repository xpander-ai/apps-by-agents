// script.js - Todo List App
// Author: xpander-ai agent
// Description: Handles all Todo app logic (add, delete, complete)

/**
 * Get todos from localStorage
 * @returns {Array} Array of todo objects
 */
function getTodos() {
    return JSON.parse(localStorage.getItem('todos') || '[]');
}

/**
 * Save todos to localStorage
 * @param {Array} todos
 */
function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Render the todo list
 */
function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    const todos = getTodos();
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const span = document.createElement('span');
        span.className = 'todo-text' + (todo.completed ? ' completed' : '');
        span.textContent = todo.text;
        span.title = 'Click to mark as completed';
        span.onclick = () => toggleComplete(idx);

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteTodo(idx);

        li.appendChild(span);
        li.appendChild(delBtn);
        todoList.appendChild(li);
    });
}

/**
 * Add a new todo
 * @param {string} text
 */
function addTodo(text) {
    const todos = getTodos();
    todos.push({ text, completed: false });
    saveTodos(todos);
    renderTodos();
}

/**
 * Delete a todo by index
 * @param {number} idx
 */
function deleteTodo(idx) {
    const todos = getTodos();
    todos.splice(idx, 1);
    saveTodos(todos);
    renderTodos();
}

/**
 * Toggle completed state
 * @param {number} idx
 */
function toggleComplete(idx) {
    const todos = getTodos();
    todos[idx].completed = !todos[idx].completed;
    saveTodos(todos);
    renderTodos();
}

// Event listeners

document.getElementById('todo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (text) {
        addTodo(text);
        input.value = '';
        input.focus();
    }
});

document.addEventListener('DOMContentLoaded', renderTodos);
