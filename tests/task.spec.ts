import { test, expect } from '@playwright/test';
import { TaskPage } from '../pages/TaskPage';

test.describe('Gestión de Tareas @Smoke', () => {
    let taskPage: TaskPage;
    let taskName: string;
    let taskDescription: string;
    let taskNames: string[] = []; // Array para rastrear múltiples tareas

    test.beforeEach(async ({ page }) => {
        taskPage = new TaskPage(page);
        taskNames = []; // Reiniciamos la lista para cada test
        taskName = `Tarea Dinámica ${Date.now()}`;
        taskDescription = 'Descripción de prueba';
        await taskPage.goto();
    });

    test.afterEach(async ({ page }, testInfo) => {
        const testsSinBorrado = ['TC002', 'TC005', 'TC004', 'TC008', 'TC009', 'TC010'];
        const saltarBorrado = testsSinBorrado.some(id => testInfo.title.includes(id));

        if (saltarBorrado) return;

        if (testInfo.status === testInfo.expectedStatus) {
            try {
                // Si el test es el de filtrar, debemos quitar el filtro 
                // para que las tareas vuelvan a ser visibles y se puedan borrar.
                if (testInfo.title.includes('TC011')) {
                    await taskPage.resetFiltersButton.click();
                    await page.keyboard.press('Escape');
                    await taskPage.page.waitForTimeout(1000);
                }

                if (taskNames.length > 0) {
                    for (const name of taskNames) {
                        // Usamos un timeout corto individual para no trabar todo el hook
                        await taskPage.deleteTask(name).catch(() => { });
                    }
                } else {
                    await taskPage.deleteTask(taskName).catch(() => { });
                }
            } catch (e) {
                const error = e as Error;
                console.log(`Error en la limpieza: ${error.message}`);
            }
        }
    });

    test('TC001 - Crear una nueva tarea', async () => {
        await taskPage.createTask(taskName, taskDescription);

        const taskElement = taskPage.page.getByText(taskName);
        await expect(taskElement).toBeVisible();
    });

    test('TC002 - Completar una tarea', async () => {
        await taskPage.createTask(taskName, taskDescription);

        await taskPage.completeTask(taskName);

        await expect(taskPage.completeButton).toBeVisible();

    });

    test('TC007 - Editar prioridad de una tarea', async () => {
        await taskPage.createTask(taskName, 'Esta tarea es muy importante');

        await taskPage.editTaskPriority(taskName, 'Prioridad 3');

        const priorityCircle = await taskPage.getPriorityCircle(taskName);

        // priority 1 --> priority_4 class
        // priority 2 --> priority_3 class
        // priority 3 --> priority_2 class
        // priority 4 --> priority_1 class
        await expect(priorityCircle).toHaveClass(/priority_2/i);

    });

    test('TC005 - Validación de nombre vacío al crear tarea', async () => {
        await taskPage.addTaskButton.click();

        await taskPage.descriptionInput.fill('Descripción sin nombre');

        await expect(taskPage.submitButton).toHaveAttribute('aria-disabled', 'true');

        // Verificación extra
        await expect(taskPage.taskInput).toBeVisible();

    });

    test('TC003 - Editar nombre de una tarea', async ({ page }) => {
        const originalName = `Tarea Inicial ${Date.now()}`;
        const newName = `Tarea Editada ${Date.now()}`;

        await taskPage.createTask(originalName);

        await taskPage.openEditForm(originalName);

        await taskPage.taskInput.fill(newName);
        await taskPage.submitButton.click();

        await expect(page.getByText(newName)).toBeVisible();
        await expect(page.getByText(originalName)).not.toBeVisible();

        // Actualizamos taskName para el afterEach
        taskName = newName;

    });

    test('TC004 - Eliminar una tarea', async ({ page }) => {
        await taskPage.createTask(taskName, taskDescription);

        await taskPage.deleteTask(taskName);

        await expect(page.getByText(taskName)).not.toBeVisible();

    });

    test('TC008 - Cancelar una tarea', async ({ page }) => {
        await taskPage.addTaskButton.click();
        await taskPage.taskInput.fill(taskName);
        await taskPage.descriptionInput.fill(taskDescription);

        await taskPage.discardTaskCreation();

        await expect(page.getByText(taskName)).not.toBeVisible();

    });

    test('TC011 - Filtrar tareas por prioridad', async ({ page }) => {
        // Primero, reestablecer cualquier filtro activo
        await taskPage.resetFilters();

        const name1 = `${taskName} Pr1`;
        await taskPage.createTask(name1, 'Tarea Prioridad 1', 'Prioridad 1');
        taskNames.push(name1);

        const name2 = `${taskName} Pr2`;
        await taskPage.createTask(name2, 'Tarea Prioridad 2', 'Prioridad 2');
        taskNames.push(name2);

        const name3 = `${taskName} Pr3`;
        await taskPage.createTask(name3, 'Tarea Prioridad 3', 'Prioridad 3');
        taskNames.push(name3);

        const name4 = `${taskName} Pr4`;
        await taskPage.createTask(name4, 'Tarea Prioridad 4', 'Prioridad 4');
        taskNames.push(name4);

        await taskPage.filterByPriority('Prioridad 2');

        await expect(page.getByText(name2),
            'La tarea con Prioridad 2 debería ser visible tras filtrar')
            .toBeVisible();

        await expect(page.getByText(name1),
            'La tarea con Prioridad 1 NO debería estar en la lista filtrada')
            .not.toBeVisible();

        await expect(page.getByText(name3),
            'La tarea con Prioridad 3 NO debería estar en la lista filtrada')
            .not.toBeVisible();

        await expect(page.getByText(name4),
            'La tarea con Prioridad 4 NO debería estar en la lista filtrada')
            .not.toBeVisible();

    });

    test('TC009 - Crear un proyecto', async ({ page }) => {
        const projectName = `Proyecto ${Date.now()}`;

        await taskPage.addProject(projectName);

        await expect(page.getByRole('link', { name: `${projectName}, 0` })).toBeVisible();
    });

    test('TC010 - Mover una tarea en un proyecto específico', async ({ page }) => {
        const projectName = `Proyecto_${Date.now()}`;
        const taskToMove = `Tarea_Mover_${Date.now()}`;

        await taskPage.addProject(projectName);

        // En lugar de esperar el heading, esperamos a que la URL contenga 'project'
        await page.waitForURL('**/app/project/**');
        await page.waitForTimeout(2000); // Espera la sincronización interna de Todoist después de la creación del proyecto

        // NAVEGACIÓN DIRECTA al Inbox
        await page.goto('https://app.todoist.com/app/inbox');
        await expect(page.getByRole('heading', { name: 'Bandeja de entrada' })).toBeVisible();

        await taskPage.createTask(taskToMove);

        await taskPage.moveTaskToProject(taskToMove, projectName);

        // NAVEGACIÓN DIRECTA al Proyecto para verificar.
        const projectLink = page.getByRole('link', { name: projectName }).first();
        await projectLink.click();

        await expect(page.getByText(taskToMove)).toBeVisible();
    });

    test('TC006 - Verificar que se pueda crear tarea con título, descripción y fecha', async ({ page }) => {
        const taskDate = 'mañana';

        await taskPage.createTask(
            taskName,
            taskDescription,
            'Prioridad 4',
            taskDate
        );

        const dynamicRegex = new RegExp(taskDate, 'i');

        await expect(page.getByTestId('task-info-tags').getByTestId('due-date-control'))
            .toHaveText(dynamicRegex);
    });
});