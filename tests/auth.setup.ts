import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Importas el POM

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  
  await loginPage.login(process.env.TODOIST_USER!, process.env.TODOIST_PASSWORD!);

  // Verificación final de que entramos
  await expect(page.getByTestId('app-sidebar-container').getByRole('button', { name: 'Añadir tarea' })).toBeVisible();

  await page.context().storageState({ path: authFile });
});