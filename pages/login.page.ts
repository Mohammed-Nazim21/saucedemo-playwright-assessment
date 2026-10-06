import { type Page } from '@playwright/test';

export class LoginPage {
  readonly username;
  readonly password;
  readonly loginButton;

  constructor(private readonly page: Page) {
    this.username = page.getByPlaceholder('Username', { exact: true });
    this.password = page.getByPlaceholder('Password', { exact: true });
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
