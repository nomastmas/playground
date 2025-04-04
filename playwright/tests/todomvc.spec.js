const { test, expect } = require('@playwright/test');
const TodoPage = require('./pages/TodoPage');

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
            await expect(todoPage.getCompletedTodoItem('buy milk')).toHaveText('buy milk');
            await expect(todoPage.getCompletedTodoItem('buy milk')).toHaveCSS('text-decoration', /line-through/);
        });

        test.skip('delete a todo item', async ({ page }) => {
            await todoPage.addTodoItem('buy milk');
            await expect(todoPage.todoItems).toHaveCount(1);
            await todoPage.deleteTodoItem('buy milk');

            await expect(todoPage.todoItems).toHaveCount(0);
        });
    });

    test.describe('intermediate', () => {
        test('edit a todo item', async ({page}) => {
            await todoPage.addTodoItem('buy milk');
            await expect(todoPage.todoItems).toHaveCount(1);

            await todoPage.editTodoItem('buy milk', 'buy eggs');
            await expect(todoPage.todoItems).toHaveText('buy eggs');
        });

        test('toggle between active and incomplete todos', async ({page}) => {
            await todoPage.addTodoItem('buy milk');
            await todoPage.addTodoItem('buy eggs');
            await todoPage.addTodoItem('buy butter');
            await expect(todoPage.todoItems).toHaveCount(3);

            await todoPage.markTodoComplete('buy eggs');
            await todoPage.switchListTo('Active');
            await expect(todoPage.todoItems.filter({ hasText: 'buy eggs' })).toHaveCount(0);
            await expect(todoPage.todoItems).toHaveCount(2);

            await todoPage.switchListTo('Completed');
            await expect(todoPage.todoItems).toHaveText('buy eggs');
            await expect(todoPage.todoItems).toHaveCount(1);

            await todoPage.switchListTo('All');
            await expect(todoPage.todoItems).toHaveCount(3);
        });

        test('clear completed todo items', async ({page}) => {
            await todoPage.addTodoItem('buy milk');
            await todoPage.addTodoItem('buy eggs');
            await todoPage.addTodoItem('buy butter');
            await expect(todoPage.todoItems).toHaveCount(3);

            await expect(todoPage.clearCompletedButton).toBeDisabled();

            await todoPage.markTodoComplete('buy eggs');
            await todoPage.markTodoComplete('buy butter');


            await expect(todoPage.getActiveTodoItem('buy milk')).toHaveText('buy milk');
            await expect(todoPage.getCompletedTodoItem('buy butter')).toHaveText('buy butter');
            await expect(todoPage.getCompletedTodoItem('buy butter')).toHaveText('buy butter');

            await todoPage.clearCompletedTodoItems();
            await expect(todoPage.todoItems).toHaveCount(1);
        });

        test('verify todo count summary is updated', async ({page}) => {
            await expect(todoPage.todoCountSummary).not.toBeVisible();

            await todoPage.addTodoItem('buy milk');
            await expect(todoPage.todoCountSummary).toHaveText('1 item left!');
            await todoPage.addTodoItem('buy eggs');
            await todoPage.addTodoItem('buy butter');
            await expect(todoPage.todoItems).toHaveCount(3);
            await expect(todoPage.todoCountSummary).toHaveText('3 items left!');

            await todoPage.markTodoComplete('buy milk');
            await todoPage.markTodoComplete('buy eggs');
            await todoPage.markTodoComplete('buy butter');
            await expect(todoPage.todoCountSummary).toHaveText('0 items left!');
        })
    });

    test.describe('edge cases', () => {
        test('cannot create empty todo item', async () => {
            await todoPage.addTodoItem('');
            await expect(todoPage.todoItems).toHaveCount(0);
        });

        test('cannot create todo item with just spaces', async () => {
            await todoPage.addTodoItem(' ');
            await expect(todoPage.todoItems).toHaveCount(0);
        });

        test('can create duplicate todo items', async () => {
            await todoPage.addTodoItem('buy eggs');
            await todoPage.addTodoItem('buy eggs');
            await expect(todoPage.todoItems).toHaveCount(2);

            await todoPage.switchListTo('Active');
            await todoPage.markTodoComplete('buy eggs');
            await todoPage.markTodoComplete('buy eggs');
            await expect(todoPage.todoItems).toHaveCount(0);
        });
    });

});