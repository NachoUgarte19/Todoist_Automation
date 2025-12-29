import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Contraseña' });
    this.loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
  }

  async goto() {
    await this.page.goto('https://app.todoist.com/auth/login?locale=es');
  }

  async login(user: string, pass: string) {
    await this.emailInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}