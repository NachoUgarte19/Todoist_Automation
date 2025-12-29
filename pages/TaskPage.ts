import { type Locator, type Page, expect } from '@playwright/test';

export class TaskPage {
    readonly page: Page;
    readonly addTaskButton: Locator;
    readonly taskInput: Locator;
    readonly descriptionInput: Locator;
    readonly submitButton: Locator;
    readonly completeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTaskButton = page.getByTestId('app-sidebar-container').getByRole('button', { name: 'Añadir tarea' });
        this.taskInput = page.getByRole('textbox', { name: 'Nombre de la tarea' }).getByRole('paragraph');
        this.descriptionInput = page.getByRole('textbox', { name: 'Descripción' }).getByRole('paragraph');
        this.submitButton = page.getByTestId('task-editor-submit-button');
        this.completeButton = page.getByText('tarea completadaDeshacer');
    }

    async goto() {
        await this.page.goto('https://app.todoist.com/app/inbox');
    }

    async createTask(
        name: string,
        description?: string,
        priority: 'Prioridad 1' | 'Prioridad 2' | 'Prioridad 3' | 'Prioridad 4' = 'Prioridad 4') {

        await this.addTaskButton.click();
        await this.taskInput.fill(name);

        if (description) {
            await this.descriptionInput.fill(description);
        }

        if (priority != 'Prioridad 4') {
            await this.page.getByRole('button', { name: /Establecer prioridad/i }).click();
            await this.page.getByRole('option', { name: priority }).click();
        }

        await this.submitButton.click();
        await expect(this.taskInput).toBeHidden();
    }

    async deleteTask(taskName: string) {
        const taskItem = this.page.locator('.task_list_item').filter({ hasText: taskName });

        await taskItem.hover();
        await this.page.getByRole('button', { name: taskName }).getByTestId('more_menu').click();

        await this.page.getByText('Eliminar').first().click();

        await this.page.getByRole('button', { name: 'Eliminar' }).click();
    }

    async completeTask(taskName: string) {
        const taskItem = this.page.locator('.task_list_item').filter({ hasText: taskName });

        const completeCheckbox = taskItem.getByRole('button', { name: taskName }).getByLabel('Marca la tarea como completada');
        await completeCheckbox.click();

    }

    async editTaskPriority(taskName: string, newPriority: 'Prioridad 1' | 'Prioridad 2' | 'Prioridad 3' | 'Prioridad 4') {
        const taskItem = this.page.locator('.task_list_item').filter({ hasText: taskName });

        await taskItem.hover();
        await this.page.getByRole('button', { name: taskName }).getByTestId('more_menu').click();

        await this.page.getByRole('menuitem', { name: newPriority }).click();
    }

    async getPriorityCircle(taskName: string) {
        return this.page.getByRole('button', { name: taskName }).getByLabel('Marca la tarea como completada')
    }

}