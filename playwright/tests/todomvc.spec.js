const { test, expect } = require('@playwright/test');
const TodoPage = require('./pages/TodoPage');
const { todo } = require('node:test');

test.describe('todo mvc', () => {
    let todoPage;
    test.beforeEach(async ({ page }) => {
        todoPage = new TodoPage(page);
        await todoPage.goto();
        await expect(page.url()).toContain('react');
        await expect(page.locator('h1')).toContainText('todos');
        await expect(page.getByTestId('todo-item-label')).toHaveCount(0);
    });

    test.describe('basic', () => {
        test('add a new todo item', async ({ page }) => {
            await todoPage.addTodoItem('buy milk');

            await expect(todoPage.todoItems).toHaveText('buy milk');
            await expect(todoPage.todoItems).toHaveCount(1);
        });

        test('mark a todo as complete', async ({ page }) => {
            await todoPage.addTodoItem('buy milk');
            await expect(todoPage.todoItems).toHaveCount(1);
            await todoPage.markTodoComplete('buy milk');

            await expect(todoPage.todoItems).toHaveText('buy milk');
            await expect(todoPage.todoItems).toHaveCount(1);
        });

        test.skip('delete a todo item', async ({ page }) => {
            await todoPage.addTodoItem('buy milk');
            await expect(todoPage.todoItems).toHaveCount(1);
            await todoPage.deleteTodoItem('buy milk');

            await expect(todoPage.todoItems).toHaveCount(0);
        });
    });

    test.describe('intermediate', () => {
    // Intermediate tests
    // Edit an existing todo
        test('edit a todo item', async ({page}) => {
            await todoPage.addTodoItem('buy milk');
            await expect(todoPage.todoItems).toHaveCount(1);

            await todoPage.editTodoItem('buy milk', 'buy eggs');
            await expect(todoPage.todoItems).toHaveText('buy eggs');
        });
    // Toggle all todos complete/incomplete
    // Clear completed todos
    // Verify todo count updates correctly
    });

    test.describe('advanced', () => {
    // Advanced tests
    // Verify todos persist after page reload (localStorage)
    // Filter todos (All/Active/Completed)
    // Add multiple todos and verify order
    // Test with long text/special characters
    // Test keyboard shortcuts (Enter to add, Esc to cancel edit)
    });

    test.describe('edge cases', () => {
    // Edge cases
    // Add empty todo (should not be allowed)
    // Add whitespace-only todo
    // Add very long todo text
    // Handle duplicate todo items
    });

});