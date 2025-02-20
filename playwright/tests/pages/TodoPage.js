const { expect } = require('@playwright/test');

class TodoPage {
    constructor(page) {
        this.page = page;
        this.newTodoInput = page.getByTestId('header').getByTestId('text-input');
        this.todoItems = page.getByTestId('todo-item');
        this.todoItemInput = this.todoItems.getByTestId('text-input');
        this.todoItemLabels = this.todoItems.getByTestId('todo-item-label');
        this.todoItemCheckbox = this.todoItems.getByTestId('todo-item-toggle');
        this.todoDelete = page.getByTestId('todo-item-button');
    }

    async goto() {
        await this.page.goto('https://todomvc.com/examples/react/dist/');
    }

    async addTodoItem(text) {
        await this.newTodoInput.fill(text);
        await this.newTodoInput.press('Enter');
    }

    async editTodoItem(text, newText) {
        const index = await this.findItemIndex(text);
        console.log(`index: ${index}`)
        if (index >= 0) await this.editTodoItemByIndex(index, newText);
        return this;
    }

    async findItemIndex(text) {
        for (let i=0; i < await this.todoItemCount(); i++) {
            const todoItemText = await this.todoItemLabels.nth(i).textContent();
            if (todoItemText === text) return i;
        }
        // not found
        return -1;
    }

    async editTodoItemByIndex(index, newText) {
        await this.todoItemLabels.nth(index).dblclick();
        await this.todoItemInput.nth(index).fill(newText);
        await this.todoItemInput.nth(index).press('Enter');
        return this;
    }

    async markTodoCompleteByIndex(index) {
        await this.todoItemCheckbox.nth(index).click();
        return this;
    }

    /*
    async deleteTodoByIndex(index) {
        await this.todoItemLabels.nth(index).hover();
        await this.todoDelete.nth(index).waitFor({state: 'visible'});
        await expect(this.todoDelete.nth(index)).toBeVisible();
        await this.todoDelete.nth(index).click();
        return this;
    }
    */

    async markTodoComplete(text) { 
        const index = await this.findItemIndex(text);
        if (index >= 0) await this.markTodoCompleteByIndex(index);
        return this;
    }

    /*
    async deleteTodoItem(text) {
        const index = this.findItemIndex(text);
        if (index >= 0) await this.deleteTodoByIndex(index);
        return this;
    }
    */

    async todoItemCount() {
        return this.todoItemLabels.count();
    }
}

module.exports = TodoPage;