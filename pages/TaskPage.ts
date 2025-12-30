import { type Locator, type Page, expect } from '@playwright/test';

export class TaskPage {
    readonly page: Page;
    readonly addTaskButton: Locator;
    readonly taskInput: Locator;
    readonly descriptionInput: Locator;
    readonly submitButton: Locator;
    readonly completeButton: Locator;
    readonly cancelButton: Locator;
    readonly discardButton: Locator;
    readonly viewButton: Locator;
    readonly resetFiltersButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTaskButton = page.getByTestId('app-sidebar-container').getByRole('button', { name: 'Añadir tarea' });
        this.taskInput = page.getByRole('textbox', { name: 'Nombre de la tarea' }).getByRole('paragraph');
        this.descriptionInput = page.getByRole('textbox', { name: 'Descripción' }).getByRole('paragraph');
        this.submitButton = page.getByTestId('task-editor-submit-button');
        this.completeButton = page.getByText('tarea completadaDeshacer');
        this.cancelButton = page.getByRole('button', { name: 'Cancelar' });
        this.discardButton = page.getByRole('button', { name: 'Descartar' });
        this.viewButton = page.getByRole('button', { name: 'Opciones del menú' });
        this.resetFiltersButton = page.getByRole('button', { name: 'Restablecer todo' })

    }

    /**
   //Retorna el locator del botón editar para una tarea específica.
 * @param taskName El nombre de la tarea tal cual aparece en la UI
 */
    getEditButtonByTaskName(taskName: string): Locator {
        return this.page
            .getByRole('button', { name: `Tarea: ${taskName}` })
            .getByLabel('Editar');
    }

    getTaskItem(taskName: string) {
        return this.page.locator('.task_list_item').filter({ hasText: taskName });
    }

    async openEditForm(taskName: string) {
        const item = this.getTaskItem(taskName);
        await item.hover();

        await item.getByRole('button', { name: taskName }).getByLabel('Editar').click();
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

    async discardTaskCreation() {
        await this.cancelButton.click();
        await this.discardButton.click();
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

    async filterByPriority(priority: 'Prioridad 1' | 'Prioridad 2' | 'Prioridad 3' | 'Prioridad 4') {
        this.viewButton.click();
        
        await this.page.getByRole('combobox', { name: 'Prioridad' }).click();
        await this.page.getByRole('option', { name: priority }).click();

    }

    async resetFilters() {
        this.viewButton.click();
        if (await this.resetFiltersButton.isVisible()) {
            await this.resetFiltersButton.click();
        } else {
            console.log('No hay filtros activos para restablecer.');
        }
    }

}