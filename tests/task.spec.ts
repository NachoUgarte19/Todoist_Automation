import { test, expect } from '@playwright/test';
import { TaskPage } from '../pages/TaskPage';

test.describe('Gestión de Tareas @Smoke', () => {
    let taskPage: TaskPage;
    let taskName: string;

    test.beforeEach(async ({ page }) => {
        taskPage = new TaskPage(page);
        taskName = `Tarea Dinámica ${Date.now()}`;
        await taskPage.goto();
    });

    test.afterEach(async ({ }, testInfo) => {
        if(testInfo.title.includes('TC002')) {
            return; // No borrar la tarea en el test de completar tarea
        }

        // Solo intentamos borrar si el test anterior pasó con éxito
        if (testInfo.status === testInfo.expectedStatus) {
            try {
                await taskPage.deleteTask(taskName).catch(() => {});
            } catch (e) {
                console.log(`No se pudo borrar la tarea: ${taskName}. Quizás no se creó.`);
            }
        }
    });

    test('TC001 - Crear una nueva tarea', async ({ page }) => {
        await taskPage.createTask(taskName, 'Descripción de prueba');

        const taskElement = taskPage.page.getByText(taskName);
        await expect(taskElement).toBeVisible();
    });

    test('TC002 - Completar una tarea', async ({ page }) => {
        await taskPage.createTask(taskName, 'Descripción de prueba');

        await taskPage.completeTask(taskName);

        await expect(taskPage.completeButton).toBeVisible();

    });

    test('TC007 - Editar prioridad de una tarea', async ({ page }) => {
        await taskPage.createTask(taskName, 'Esta tarea es muy importante');

        await taskPage.editTaskPriority(taskName, 'Prioridad 3');

        const priorityCircle = await taskPage.getPriorityCircle(taskName);

        // priority 1 --> priority_4 class
        // priority 2 --> priority_3 class
        // priority 3 --> priority_2 class
        // priority 4 --> priority_1 class
        await expect(priorityCircle).toHaveClass(/priority_2/i);

    });

});