// tests.js - Simple test suite for Todo List App
// Run in browser console or include via <script>

function testAddTodo() {
    localStorage.clear();
    addTodo('Test Task 1');
    const todos = getTodos();
    if (todos.length !== 1 || todos[0].text !== 'Test Task 1') {
        throw new Error('Add Todo failed');
    }
    console.log('testAddTodo passed');
}

function testDeleteTodo() {
    localStorage.clear();
    addTodo('Task to Delete');
    deleteTodo(0);
    const todos = getTodos();
    if (todos.length !== 0) {
        throw new Error('Delete Todo failed');
    }
    console.log('testDeleteTodo passed');
}

function testToggleComplete() {
    localStorage.clear();
    addTodo('Task to Complete');
    toggleComplete(0);
    const todos = getTodos();
    if (!todos[0].completed) {
        throw new Error('Toggle Complete failed');
    }
    toggleComplete(0);
    if (todos[0].completed) {
        throw new Error('Toggle Complete (uncomplete) failed');
    }
    console.log('testToggleComplete passed');
}

function runAllTests() {
    testAddTodo();
    testDeleteTodo();
    testToggleComplete();
    console.log('All tests passed!');
}

// Uncomment to run all tests automatically
// runAllTests();
