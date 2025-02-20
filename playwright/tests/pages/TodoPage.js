const { expect } = require('@playwright/test');

class TodoPage {
    constructor(page) {
        this.page = page;
        this.todoInput = page.getByTestId('text-input');
        this.todoItems = page.getByTestId('todo-item-label');
        this.todoCheckbox = page.getByTestId('todo-item-toggle');
        this.todoDelete = page.getByTestId('todo-item-button');
    }

    async goto() {
        await this.page.goto('https://todomvc.com/examples/react/dist/');
    }

    async addTodo(text) {
        await this.todoInput.fill(text);
        await this.todoInput.press('Enter');
    }

    async findItemIndex(text) {
        for (let i=0; i < this.todoItemCount(); i++) {
            const todoItemText = this.todoItems.nth(i).textContent;
            if (todoItemText === text) return i;
        }
        // not found
        return -1;
    }

    async markTodoCompleteByIndex(index) {
        await this.todoCheckbox.nth(index).click();
        return this;
    }

    async deleteTodoByIndex(index) {
        await this.todoItems.nth(index).hover();
        await this.todoDelete.nth(index).waitFor({state: 'visible'});
        await expect(this.todoDelete.nth(index)).toBeVisible();
        await this.todoDelete.nth(index).click();
        return this;
    }

    async markTodoComplete(text) { 
        const index = this.findItemIndex(text);
        if (index >= 0) await this.markTodoCompleteByIndex(index);
        return this;
    }

    async deleteTodoItem(text) {
        const index = this.findItemIndex(text);
        if (index >= 0) await this.deleteTodoByIndex(index);
        return this;
    }

    async todoItemCount() {
        return this.todoItems.count();
    }
}

module.exports = TodoPage;