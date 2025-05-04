// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const itemsLeftText = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');

// App State
let todos = [];
let currentFilter = 'all';

// Initialize the app
function init() {
    loadTodos();
    renderTodos();
    updateItemsLeft();
    
    // Event listeners
    todoForm.addEventListener('submit', addTodo);
    todoList.addEventListener('click', handleTodoClick);
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // Filter event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            setFilter(button.dataset.filter);
        });
    });
}

// Load todos from localStorage
function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Add a new todo
function addTodo(e) {
    e.preventDefault();
    
    const text = todoInput.value.trim();
    if (text === '') return;
    
    const newTodo = {
        id: Date.now(),
        text,
        completed: false
    };
    
    todos.unshift(newTodo); // Add to beginning of array
    saveTodos();
    renderTodos();
    updateItemsLeft();
    
    todoInput.value = '';
    todoInput.focus();
}

// Render todos based on current filter
function renderTodos() {
    todoList.innerHTML = '';
    
    const filteredTodos = filterTodos();
    
    if (filteredTodos.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = currentFilter === 'all' 
            ? 'Your todo list is empty!' 
            : currentFilter === 'active' 
                ? 'No active tasks!' 
                : 'No completed tasks!';
        todoList.appendChild(emptyState);
        return;
    }
    
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        todoList.appendChild(li);
    });
}

// Filter todos based on current filter
function filterTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Set the current filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    filterButtons.forEach(button => {
        if (button.dataset.filter === filter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    renderTodos();
}

// Handle clicks on todo items (checkbox and delete)
function handleTodoClick(e) {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;
    
    const id = parseInt(todoItem.dataset.id);
    
    // Handle checkbox click
    if (e.target.classList.contains('todo-checkbox')) {
        toggleTodoCompleted(id);
    }
    
    // Handle delete button click
    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        deleteTodo(id);
    }
}

// Toggle todo completed status
function toggleTodoCompleted(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
    updateItemsLeft();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateItemsLeft();
}

// Clear all completed todos
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateItemsLeft();
}

// Update the items left counter
function updateItemsLeft() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    itemsLeftText.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);