const { test, expect } = require('@playwright/test');

test.describe('todo mvc', () => {
    test.describe('basic', () => {
    // Basic tests
    // Add a new todo item
    // Mark a todo as complete
    // Delete a todo item
        test.beforeEach(async ({ page }) => {
            await page.goto('https://todomvc.com/examples/react/dist/');
            await expect(page.url()).toContain('react');
            await expect(page.locator('h1')).toContainText('todos');
        });

        test('add a new todo item', async ({ page }) => {
            await page.getByTestId('text-input').fill('buy milk');
            await page.getByTestId('text-input').press('Enter');
            await expect(page.getByTestId('todo-item-label')).toHaveText('buy milk');
            await expect(page.getByTestId('todo-item-label')).toHaveCount(1);
        });

        test('mark a todo as complete', async ({ page }) => {
            await page.getByTestId('text-input').fill('buy milk');
            await page.getByTestId('text-input').press('Enter');
            await expect(page.getByTestId('todo-item-label')).toHaveCount(1);
            await page.getByTestId('todo-item-toggle').click();
            await expect(page.getByTestId('todo-item-label')).toHaveCount(1);
            await expect(page.locator('.todo-count')).toHaveText('0 items left!');
        });

        test('delete a todo item', async ({ page }) => {
            await page.getByTestId('text-input').fill('buy milk');
            await page.getByTestId('text-input').press('Enter');
            await expect(page.getByTestId('todo-item-label')).toHaveCount(1);
            await page.getByTestId('todo-item-label').hover();
            await expect(page.getByTestId('todo-item-button')).toBeVisible();
            await page.getByTestId('todo-item-button').click();
            await expect(page.getByTestId('todo-item-label')).toHaveCount(0);
        });
    });

    test.describe('intermediate', () => {
    // Intermediate tests
    // Edit an existing todo
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